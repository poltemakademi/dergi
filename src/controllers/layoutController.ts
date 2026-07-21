import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: calculate priority based on days since accepted
// ─────────────────────────────────────────────────────────────────────────────
const calcPriority = (createdAt: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
  const daysSince = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince > 14) return 'HIGH';
  if (daysSince > 7) return 'MEDIUM';
  return 'LOW';
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/layout/queue
// Returns all articles in ACCEPTED or IN_COPYEDITING state for the layout editor
// ─────────────────────────────────────────────────────────────────────────────
export const getProductionQueue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Fetch submissions ready for layout work
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('id, title, status, created_at')
      .in('status', ['ACCEPTED', 'IN_COPYEDITING'])
      .order('created_at', { ascending: true }); // oldest first = highest priority

    if (error) {
      res.status(500).json({ error: 'Failed to fetch production queue', details: error.message });
      return;
    }

    // Shape response for Queue.tsx: { id, title, priority, date }
    const queue = (submissions || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      priority: calcPriority(s.created_at),
      date: s.created_at,
    }));

    res.status(200).json(queue);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/layout/article/:id
// Returns article metadata for the Proofs page header
// ─────────────────────────────────────────────────────────────────────────────
export const getArticleForLayout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Fetch submission + primary author info
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('id, title, author_id, status')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Fetch the primary author's display name from submission_authors
    const { data: authorData } = await supabase
      .from('submission_authors')
      .select('display_name, email')
      .eq('submission_id', id)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    // Shape for Proofs.tsx: { id, title, author }
    const articleForLayout = {
      id: submission.id,
      title: submission.title,
      author: authorData?.display_name || authorData?.email || 'Unknown Author',
      status: submission.status,
    };

    res.status(200).json(articleForLayout);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/layout/article/:id/source
// Generates a signed download URL for the original manuscript PDF
// ─────────────────────────────────────────────────────────────────────────────
export const downloadSource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify article exists and is in a layout-eligible status
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('id, status')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Try original manuscript path, then revision path
    const paths = [
      `manuscripts/${id}/manuscript.pdf`,
      `manuscripts/${id}/revision_latest.pdf`,
    ];

    let signedUrl: string | null = null;

    for (const path of paths) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from('manuscripts')
        .createSignedUrl(path, 600); // 10 minutes

      if (!signedError && signedData?.signedUrl) {
        signedUrl = signedData.signedUrl;
        break;
      }
    }

    if (!signedUrl) {
      res.status(404).json({
        error: 'Source PDF not found in storage. The manuscript may not have been uploaded yet.',
      });
      return;
    }

    // Redirect browser to signed download URL
    res.redirect(302, signedUrl);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/layout/upload-proof
// Receives formatted proof PDF, uploads to storage, marks article as
// READY_FOR_PRODUCTION and logs status change
// ─────────────────────────────────────────────────────────────────────────────
export const uploadProof = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // articleId is sent as a form field in the FormData (from Proofs.tsx)
    const articleId = req.body?.articleId;

    if (!articleId) {
      res.status(400).json({ error: 'articleId is required in the request body' });
      return;
    }

    // 1. Verify the article exists and is in a layout-eligible status
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('status')
      .eq('id', articleId)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const eligibleStatuses = ['ACCEPTED', 'IN_COPYEDITING'];
    if (!eligibleStatuses.includes(submission.status)) {
      res.status(409).json({
        error: `Cannot upload proof for article with status: ${submission.status}`,
      });
      return;
    }

    // 2. Read raw file buffer from the request body stream
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => resolve());
      req.on('error', reject);
    });
    const fileBuffer = Buffer.concat(chunks);

    if (!fileBuffer.length) {
      res.status(400).json({ error: 'No file data received' });
      return;
    }

    // 3. Upload formatted proof to Supabase Storage
    const proofPath = `proofs/${articleId}/proof_${Date.now()}.pdf`;
    const { error: storageError } = await supabase.storage
      .from('proofs')
      .upload(proofPath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (storageError) {
      res.status(500).json({
        error: 'Failed to upload proof to storage',
        details: storageError.message,
      });
      return;
    }

    // 4. Update submission status to READY_FOR_PRODUCTION
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ status: 'READY_FOR_PRODUCTION' })
      .eq('id', articleId);

    if (updateError) {
      res.status(500).json({
        error: 'Proof uploaded but failed to update status',
        details: updateError.message,
      });
      return;
    }

    // 5. Log to status history
    await supabase.from('submission_status_history').insert({
      submission_id: articleId,
      old_status: submission.status,
      new_status: 'READY_FOR_PRODUCTION',
      actor_user_id: userId,
      note: `Formatted proof uploaded by layout editor: ${proofPath}`,
    });

    res.status(200).json({
      message: 'Proof uploaded successfully. Article marked as READY_FOR_PRODUCTION.',
      proofPath,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
