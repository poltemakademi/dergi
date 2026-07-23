import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

// In-memory store for mock invitations that have been responded to
// (used when Supabase returns no data and fallback mock data is shown)
const respondedMockInvitationIds = new Set<string>();

// Default mock invitations (used as fallback when no DB data)
const MOCK_INVITATIONS = [
  {
    id: 'INV-101',
    title: 'Yapay Zeka ve Veri Madenciliği ile Eğitimde Başarı Analizi',
    abstract: 'Bu çalışma, yükseköğretim kurumlarında öğrencilerin akademik başarılarını ve devam durumlarını tahmin etmek için yapay zeka ve makine öğrenmesi algoritmalarının kullanımını incelemektedir. 5.000 öğrenci verisi üzerinde yapılan deneysel sonuçlar, önerilen modelin %94 doğruluk oranına ulaştığını ve erken uyarı sistemi olarak kullanılabileceğini göstermektedir.',
    invitedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 14).toISOString()
  },
  {
    id: 'INV-102',
    title: 'Yenilenebilir Enerji Sistemlerinde Akıllı Şebeke Optimizasyonu',
    abstract: 'Güneş ve rüzgar santrallerinden elde edilen elektriğin şehir şebekelerine kesintisiz ve dengeli aktarımı için geliştirilen yeni optimizasyon algoritması sunulmaktadır. Geliştirilen yaklaşım, enerji kayıplarını %18 oranında azaltmakta ve hat yüklenmelerini dengelemektedir.',
    invitedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 10).toISOString()
  },
  {
    id: 'INV-103',
    title: 'Siber Güvenlikte Blokzincir Tabanlı Güvenli Kimlik Doğrulama',
    abstract: 'Bu araştırma, kurumsal ağlarda veri sızıntılarını önlemek ve yetkisiz erişimleri engellemek amacıyla dağıtık blokzincir mimarisine dayalı tekil oturum açma (SSO) ve şifreli kimlik doğrulama protokolü önermektedir.',
    invitedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 7).toISOString()
  }
];

export const getAssignedReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Join review_assignments with submissions
    // We fetch assignments where reviewer_id = userId
    const { data: assignments, error } = await supabase
      .from('review_assignments')
      .select('*, submissions(*)')
      .eq('reviewer_id', userId);

    if (error) {
      res.status(500).json({ error: 'Failed to fetch assigned reviews', details: error.message });
      return;
    }

    // THE BLINDING INTERCEPTOR for listing
    // We map over results and ensure submission_authors and author_id are not included
    const sanitizedData = assignments?.map((a: any) => {
      if (a.submissions) {
        if (a.submissions.submission_authors) {
          delete a.submissions.submission_authors;
        }
        if (a.submissions.author_id) {
          delete a.submissions.author_id;
        }
      }
      return a;
    }) || [];

    if (sanitizedData.length === 0) {
      res.status(200).json({
        data: [
          {
            id: 'SUB-2026-089',
            title: 'Deep Reinforcement Learning for Autonomous UAV Trajectory Optimization in GPS-Denied Environments',
            deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
            status: 'Under Review'
          },
          {
            id: 'SUB-2026-094',
            title: 'Ethical Implications and Governance Frameworks for Large Language Models in Higher Education',
            deadline: new Date(Date.now() + 86400000 * 18).toISOString(),
            status: 'Under Review'
          }
        ]
      });
      return;
    }

    res.status(200).json({ data: sanitizedData });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const getArticleForReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Support test manuscript fallback IDs
    if (id.startsWith('SUB-') || id.startsWith('INV-')) {
      res.status(200).json({
        data: {
          id,
          title: id === 'INV-101'
            ? 'Yapay Zeka ve Veri Madenciliği ile Eğitimde Başarı Analizi'
            : id === 'INV-102'
              ? 'Yenilenebilir Enerji Sistemlerinde Akıllı Şebeke Optimizasyonu'
              : id === 'INV-103'
                ? 'Siber Güvenlikte Blokzincir Tabanlı Güvenli Kimlik Doğrulama'
                : id === 'SUB-2026-089'
                  ? 'Yapay Zeka Tabanlı Otonom İHA Rota Optimizasyonu'
                  : 'Yükseköğretimde Büyük Dil Modellerinin Etik ve Yönetişim Çerçeveleri',
          abstract: 'Bu çalışma, gelişmiş yapay zeka ve derin öğrenme algoritmalarının gerçek zamanlı veri kümesi üzerindeki performansını ve rasyonel karar alma süreçlerini incelemektedir...',
          keywords: 'Yapay Zeka, Veri Madenciliği, Optimizasyon, Siber Güvenlik',
          pdf_url: '/demo-manuscript.pdf'
        }
      });
      return;
    }

    // 1. Verify this reviewer is actually assigned to this article
    const { data: assignment, error: assignmentError } = await supabase
      .from('review_assignments')
      .select('id')
      .eq('submission_id', id)
      .eq('reviewer_id', userId)
      .single();

    if (assignmentError || !assignment) {
      res.status(403).json({ error: 'Forbidden: You are not assigned to review this article' });
      return;
    }

    // 2. Fetch submission details
    // We purposely do NOT ask for submission_authors, but if someone changes this query later,
    // we must actively intercept and strip author data.
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // THE BLINDING INTERCEPTOR (DOUBLE BLIND LOGIC)
    // We MUST actively delete/omit any data referencing authors before sending to reviewer.
    if (submission.submission_authors) {
      delete submission.submission_authors;
    }

    // Also remove author_id just to be safe
    if (submission.author_id) {
      delete submission.author_id;
    }

    res.status(200).json({ data: submission });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const evaluateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Accept structured payload from Evaluate.tsx
    const { scores, notesForAuthor, confidentialNotes, recommendation, content } = req.body;

    // Build the stored content — support both structured payload and legacy text
    const reviewContent = content || JSON.stringify({
      scores,
      notesForAuthor,
      confidentialNotes,
      recommendation,
    });

    if (!reviewContent) {
      res.status(400).json({ error: 'Review content is required' });
      return;
    }

    if (id.startsWith('SUB-') || id.startsWith('INV-')) {
      res.status(201).json({
        message: 'Review submitted successfully',
        data: { id: `REV-${Date.now()}`, submission_id: id, status: 'completed' }
      });
      return;
    }

    // Find the assignment id
    const { data: assignment, error: assignmentError } = await supabase
      .from('review_assignments')
      .select('id')
      .eq('submission_id', id)
      .eq('reviewer_id', userId)
      .single();

    if (assignmentError || !assignment) {
      res.status(403).json({ error: 'Forbidden: You are not assigned to review this article' });
      return;
    }

    // Insert review (final submission, not draft)
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        assignment_id: assignment.id,
        reviewer_id: userId,
        content: reviewContent,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to submit review', details: error.message });
      return;
    }

    // Update assignment status to completed
    await supabase
      .from('review_assignments')
      .update({ status: 'completed' })
      .eq('id', assignment.id);

    res.status(201).json({ message: 'Review submitted successfully', data });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW: GET /api/reviewer/article/:id/pdf
// Streams the blinded PDF securely to the reviewer (Blob response)
// Verifies reviewer assignment before serving the file
// ─────────────────────────────────────────────────────────────────────────────
export const getPdfForReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (id.startsWith('SUB-') || id.startsWith('INV-')) {
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline; filename="manuscript.pdf"');
      res.set('Cache-Control', 'no-store');
      const samplePdf = Buffer.from(
        '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>/ProcSet[/PDF/Text]>>/Contents 5 0 R>>endobj 4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj 5 0 obj<</Length 82>>stream\nBT /F1 18 Tf 50 700 Td (Double-Blind Academic Peer Review Manuscript) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000249 00000 n\n0000000317 00000 n\ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n448\n%%EOF'
      );
      res.status(200).send(samplePdf);
      return;
    }

    // 1. Verify this reviewer is actually assigned
    const { data: assignment, error: assignmentError } = await supabase
      .from('review_assignments')
      .select('id')
      .eq('submission_id', id)
      .eq('reviewer_id', userId)
      .single();

    if (assignmentError || !assignment) {
      res.status(403).json({ error: 'Forbidden: You are not assigned to review this article' });
      return;
    }

    // 2. Build the storage path for this manuscript
    // Convention: manuscripts/{submission_id}/manuscript.pdf
    // Try multiple path conventions (original upload or revision)
    const manuscriptPath = `manuscripts/${id}/manuscript.pdf`;

    // 3. Generate a signed URL from Supabase Storage (valid for 5 minutes)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('manuscripts')
      .createSignedUrl(manuscriptPath, 300); // 300 seconds = 5 minutes

    if (signedError || !signedData?.signedUrl) {
      // Fallback: try to download and stream directly
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('manuscripts')
        .download(manuscriptPath);

      if (downloadError || !fileData) {
        res.status(404).json({
          error: 'PDF not found in storage. The manuscript may not have been uploaded yet.',
          details: downloadError?.message,
        });
        return;
      }

      // Stream the PDF blob
      const arrayBuffer = await fileData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline; filename="review.pdf"');
      res.set('Cache-Control', 'no-store');
      res.status(200).send(buffer);
      return;
    }

    // 4. Redirect to signed URL (browser fetches PDF directly from Supabase CDN)
    res.redirect(302, signedData.signedUrl);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW: PUT /api/reviewer/evaluate/:id/draft
// Saves or updates a draft evaluation (upsert pattern)
// Used by the "Save Draft" button in Evaluate.tsx
// ─────────────────────────────────────────────────────────────────────────────
export const saveDraftEvaluation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { scores, notesForAuthor, confidentialNotes, recommendation } = req.body;

    if (id === 'SUB-2026-089' || id === 'SUB-2026-094' || id === 'INV-2026-041') {
      res.status(200).json({ message: 'Draft saved successfully' });
      return;
    }

    // 1. Verify reviewer is assigned
    const { data: assignment, error: assignmentError } = await supabase
      .from('review_assignments')
      .select('id')
      .eq('submission_id', id)
      .eq('reviewer_id', userId)
      .single();

    if (assignmentError || !assignment) {
      res.status(403).json({ error: 'Forbidden: You are not assigned to review this article' });
      return;
    }

    // 2. Build structured draft content
    const draftContent = JSON.stringify({
      scores: scores || { originality: 0, rigor: 0 },
      notesForAuthor: notesForAuthor || '',
      confidentialNotes: confidentialNotes || '',
      recommendation: recommendation || '',
      savedAt: new Date().toISOString(),
      isDraft: true,
    });

    // 3. Check if a draft already exists for this assignment
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('assignment_id', assignment.id)
      .eq('reviewer_id', userId)
      .maybeSingle();

    if (existingReview) {
      // Update existing draft
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ content: draftContent })
        .eq('id', existingReview.id);

      if (updateError) {
        res.status(500).json({ error: 'Failed to update draft', details: updateError.message });
        return;
      }
    } else {
      // Insert new draft
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          assignment_id: assignment.id,
          reviewer_id: userId,
          content: draftContent,
        });

      if (insertError) {
        res.status(500).json({ error: 'Failed to save draft', details: insertError.message });
        return;
      }
    }

    res.status(200).json({ message: 'Draft saved successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};


export const getInvitations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: invitations, error } = await supabase
      .from('review_assignments')
      .select('*, submissions(*)')
      .eq('reviewer_id', userId)
      .eq('status', 'pending');

    if (error) {
      res.status(500).json({ error: 'Failed to fetch invitations', details: error.message });
      return;
    }

    const sanitizedData = invitations?.map((a: any) => {
      if (a.submissions) {
        if (a.submissions.submission_authors) {
          delete a.submissions.submission_authors;
        }
        if (a.submissions.author_id) {
          delete a.submissions.author_id;
        }
      }
      return a;
    }) || [];

    if (sanitizedData.length === 0) {
      // Return mock invitations filtered by responded IDs
      const remaining = MOCK_INVITATIONS.filter(inv => !respondedMockInvitationIds.has(inv.id));
      res.status(200).json({ data: remaining });
      return;
    }

    res.status(200).json({ data: sanitizedData });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const getReviewHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: history, error } = await supabase
      .from('review_assignments')
      .select('*, submissions(*)')
      .eq('reviewer_id', userId)
      .in('status', ['completed', 'rejected', 'evaluated']);

    if (error) {
      res.status(500).json({ error: 'Failed to fetch review history', details: error.message });
      return;
    }

    const sanitizedData = history?.map((a: any) => {
      if (a.submissions) {
        if (a.submissions.submission_authors) {
          delete a.submissions.submission_authors;
        }
        if (a.submissions.author_id) {
          delete a.submissions.author_id;
        }
      }
      return a;
    }) || [];

    res.status(200).json({ data: sanitizedData });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const respondToInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { invitationId, accept } = req.body;

    // Track responded mock invitation IDs so they disappear from future fetches
    if (invitationId && (invitationId.startsWith('INV-'))) {
      respondedMockInvitationIds.add(invitationId);
    }

    if (invitationId && !invitationId.startsWith('INV-')) {
      await supabase
        .from('review_assignments')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', invitationId)
        .eq('reviewer_id', userId);
    }

    res.status(200).json({
      message: accept ? 'Invitation accepted successfully' : 'Invitation declined'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
