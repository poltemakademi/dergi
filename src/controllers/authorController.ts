import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAuthorSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID missing' });
      return;
    }

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
  }
};
