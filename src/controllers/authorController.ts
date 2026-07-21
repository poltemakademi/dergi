import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAuthorSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID missing' });
      return;
    }

    // Fetch submissions where this user is the author
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (submissionsError) {
      res.status(500).json({ error: 'Failed to retrieve submissions', details: submissionsError.message });
      return;
    }

    res.status(200).json({ data: submissions });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const submitManuscript = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID missing' });
      return;
    }

    const { title, journal_id, coAuthors } = req.body;

    if (!title || !journal_id) {
      res.status(400).json({ error: 'Bad Request: title and journal_id are required' });
      return;
    }

    // 1. Insert into submissions
    const { data: newSubmission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        title,
        journal_id,
        author_id: userId,
        status: 'PENDING_PRE_CHECK'
      })
      .select()
      .single();

    if (submissionError || !newSubmission) {
      res.status(500).json({ error: 'Failed to create submission', details: submissionError?.message });
      return;
    }

    // 2. Insert into submission_authors for the main author + any co-authors
    // Ensure the submitting user is always included as the primary author
    const authorsToInsert = [
      {
        submission_id: newSubmission.id,
        user_id: userId,
        display_name: req.user?.email || 'Primary Author', // Fallback name
        email: req.user?.email,
        sort_order: 1
      }
    ];

    if (Array.isArray(coAuthors) && coAuthors.length > 0) {
      coAuthors.forEach((ca, index) => {
        authorsToInsert.push({
          submission_id: newSubmission.id,
          user_id: null, // Unregistered co-authors might not have a user_id yet
          display_name: ca.name,
          email: ca.email,
          sort_order: index + 2
        });
      });
    }

    const { error: authorsInsertError } = await supabase
      .from('submission_authors')
      .insert(authorsToInsert);

    if (authorsInsertError) {
      // Non-fatal, but we should log or inform
      console.warn('Failed to insert co-authors', authorsInsertError);
    }

    // 3. Insert initial log into submission_status_history
    const { error: historyError } = await supabase
      .from('submission_status_history')
      .insert({
        submission_id: newSubmission.id,
        old_status: null,
        new_status: 'PENDING_PRE_CHECK',
        actor_user_id: userId,
        note: 'Initial Submission'
      });

    if (historyError) {
      console.warn('Failed to log submission status history', historyError);
    }

    res.status(201).json({ message: 'Submission successful', data: newSubmission });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

<<<<<<< HEAD
// ─────────────────────────────────────────────────────────────────────────────
// NEW: GET /api/author/submissions/:id
// Returns single submission + status history (used by Track.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const getSubmissionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch the submission
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    // 2. Verify the requesting user is one of the authors
    const { data: authorLink, error: authorLinkError } = await supabase
      .from('submission_authors')
      .select('id')
      .eq('submission_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    // Also allow if they are the direct author_id
    if ((authorLinkError || !authorLink) && submission.author_id !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this submission' });
      return;
    }

    // 3. Fetch status history ordered by date
    const { data: historyData, error: historyError } = await supabase
      .from('submission_status_history')
      .select('new_status, created_at, note')
      .eq('submission_id', id)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.warn('Failed to fetch status history', historyError);
    }

    // 4. Shape the statusHistory for Track.tsx pipeline
    const statusHistory = (historyData || []).map((h: any) => ({
      status: h.new_status,
      date: h.created_at,
      note: h.note || null,
    }));

    res.status(200).json({
      id: submission.id,
      title: submission.title,
      status: submission.status,
      created_at: submission.created_at,
      statusHistory,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW: POST /api/author/withdraw/:id
// Withdraws a submission and revokes all pending review assignments
// ─────────────────────────────────────────────────────────────────────────────
export const withdrawSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch submission and verify ownership
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('status, author_id')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    if (submission.author_id !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this submission' });
      return;
    }

    // 2. Block withdrawal of already terminal states
    const terminalStates = ['PUBLISHED', 'WITHDRAWN'];
    if (terminalStates.includes(submission.status)) {
      res.status(409).json({ error: `Cannot withdraw a submission with status: ${submission.status}` });
      return;
    }

    // 3. Update submission status to WITHDRAWN
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ status: 'WITHDRAWN' })
      .eq('id', id);

    if (updateError) {
      res.status(500).json({ error: 'Failed to withdraw submission', details: updateError.message });
      return;
    }

    // 4. Revoke all pending review assignments
    await supabase
      .from('review_assignments')
      .update({ status: 'revoked' })
      .eq('submission_id', id)
      .eq('status', 'assigned');

    // 5. Log to status history
    await supabase.from('submission_status_history').insert({
      submission_id: id,
      old_status: submission.status,
      new_status: 'WITHDRAWN',
      actor_user_id: userId,
      note: 'Withdrawn by author',
    });

    res.status(200).json({ message: 'Submission withdrawn successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW: POST /api/author/revisions/:id
// Accepts a revised PDF (base64 in body or via Supabase Storage upload)
// and resets status to PENDING_PRE_CHECK for re-review
// ─────────────────────────────────────────────────────────────────────────────
export const uploadRevision = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Verify ownership and correct status
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('status, author_id')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    if (submission.author_id !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this submission' });
      return;
    }

    if (submission.status !== 'REVISION_REQUIRED') {
      res.status(409).json({ error: 'Revisions can only be uploaded when status is REVISION_REQUIRED' });
      return;
    }

    // 2. Read raw body as buffer (Express with express.raw() or process chunks)
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

    // 3. Upload to Supabase Storage
    const storagePath = `manuscripts/${id}/revision_${Date.now()}.pdf`;
    const { error: storageError } = await supabase.storage
      .from('manuscripts')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (storageError) {
      res.status(500).json({ error: 'Failed to upload revision to storage', details: storageError.message });
      return;
    }

    // 4. Update submission status back to PENDING_PRE_CHECK for editor re-review
    await supabase
      .from('submissions')
      .update({ status: 'PENDING_PRE_CHECK' })
      .eq('id', id);

    // 5. Log to status history
    await supabase.from('submission_status_history').insert({
      submission_id: id,
      old_status: 'REVISION_REQUIRED',
      new_status: 'PENDING_PRE_CHECK',
      actor_user_id: userId,
      note: `Revised manuscript uploaded: ${storagePath}`,
    });

    res.status(200).json({ message: 'Revision uploaded successfully. Submission returned for editorial review.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};


export const getAuthorSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
=======
export const getSubmissionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
>>>>>>> 5b65d661476a3ecfd1daeae2f17e455521fd73b1
      res.status(401).json({ error: 'Unauthorized: User ID missing' });
      return;
    }

<<<<<<< HEAD
    // Fetch submissions where this user is an author
    // First, find the submission IDs linked to this user in submission_authors
    const { data: authoredData, error: authorsError } = await supabase
      .from('submission_authors')
      .select('submission_id')
      .eq('user_id', userId);

    if (authorsError) {
      res.status(500).json({ error: 'Failed to retrieve author links', details: authorsError.message });
      return;
    }

    if (!authoredData || authoredData.length === 0) {
      res.status(200).json({ data: [] });
      return;
    }

    const submissionIds = authoredData.map(a => a.submission_id);

    // Fetch the actual submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .in('id', submissionIds)
      .order('created_at', { ascending: false });

    if (submissionsError) {
      res.status(500).json({ error: 'Failed to retrieve submissions', details: submissionsError.message });
      return;
    }

    res.status(200).json({ data: submissions });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const submitManuscript = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID missing' });
      return;
    }

    const { title, journal_id, coAuthors } = req.body;

    if (!title || !journal_id) {
      res.status(400).json({ error: 'Bad Request: title and journal_id are required' });
      return;
    }

    // 1. Insert into submissions
    const { data: newSubmission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        title,
        journal_id,
        author_id: userId,
        status: 'PENDING_PRE_CHECK'
      })
      .select()
      .single();

    if (submissionError || !newSubmission) {
      res.status(500).json({ error: 'Failed to create submission', details: submissionError?.message });
      return;
    }

    // 2. Insert into submission_authors for the main author + any co-authors
    // Ensure the submitting user is always included as the primary author
    const authorsToInsert = [
      {
        submission_id: newSubmission.id,
        user_id: userId,
        display_name: req.user?.email || 'Primary Author', // Fallback name
        email: req.user?.email,
        sort_order: 1
      }
    ];

    if (Array.isArray(coAuthors) && coAuthors.length > 0) {
      coAuthors.forEach((ca, index) => {
        authorsToInsert.push({
          submission_id: newSubmission.id,
          user_id: null, // Unregistered co-authors might not have a user_id yet
          display_name: ca.name,
          email: ca.email,
          sort_order: index + 2
        });
      });
    }

    const { error: authorsInsertError } = await supabase
      .from('submission_authors')
      .insert(authorsToInsert);

    if (authorsInsertError) {
      // Non-fatal, but we should log or inform
      console.warn('Failed to insert co-authors', authorsInsertError);
    }

    // 3. Insert initial log into submission_status_history
    const { error: historyError } = await supabase
      .from('submission_status_history')
      .insert({
        submission_id: newSubmission.id,
        old_status: null,
        new_status: 'PENDING_PRE_CHECK',
        actor_user_id: userId,
        note: 'Initial Submission'
      });

    if (historyError) {
      console.warn('Failed to log submission status history', historyError);
    }

    res.status(201).json({ message: 'Submission successful', data: newSubmission });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
=======
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (submissionError || !submission) {
      res.status(404).json({ error: 'Not Found' });
      return;
    }

    // Optionally check if the user is authorized to view this submission
    // For now, if they are the author, they can view it.
    if (submission.author_id !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.status(200).json({ data: submission });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error' });
>>>>>>> 5b65d661476a3ecfd1daeae2f17e455521fd73b1
  }
};
