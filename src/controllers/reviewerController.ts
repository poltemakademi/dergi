import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

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
    // We map over results and ensure submission_authors is not included
    // Wait, the select above doesn't explicitly request submission_authors, so it's safe.
    // But we manually sanitize just in case.
    const sanitizedData = assignments?.map((a: any) => {
      if (a.submissions && a.submissions.submission_authors) {
        delete a.submissions.submission_authors;
      }
      return a;
    }) || [];

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
      .select('*, submission_authors(*)')
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
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!content) {
      res.status(400).json({ error: 'Review content is required' });
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

    // Insert review
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        assignment_id: assignment.id,
        reviewer_id: userId,
        content
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
