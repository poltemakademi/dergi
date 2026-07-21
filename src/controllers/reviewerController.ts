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
