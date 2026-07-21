import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

// Valid status enum values matching the DB enum public.submission_status
const VALID_STATUSES = [
  'PENDING_PRE_CHECK',
  'IN_REVIEW',
  'REVISION_REQUIRED',
  'ACCEPTED',
  'IN_COPYEDITING',
  'READY_FOR_PRODUCTION',
  'PUBLISHED',
  'WITHDRAWN',
] as const;

export const getEditorArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, status, page = '1', limit = '10', not_in_issue } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('submissions')
      .select('*, submission_authors(*)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Filter out articles already assigned to an issue
    if (not_in_issue === 'true') {
      // Get submission IDs already in issue_articles
      const { data: issuedIds } = await supabase
        .from('issue_articles')
        .select('submission_id');
      const ids = (issuedIds || []).map((ia: any) => ia.submission_id);
      if (ids.length > 0) {
        query = query.not('id', 'in', `(${ids.join(',')})`);
      }
    }

    query = query.range(offset, offset + limitNum - 1).order('created_at', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      res.status(500).json({ error: 'Failed to fetch articles', details: error.message });
      return;
    }

    res.status(200).json({
      data: data || [],
      total: count || 0,
      page: pageNum,
      totalPages: Math.ceil((count || 0) / limitNum)
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const updateArticleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    // ✅ FIX: Enum validation — reject invalid status values
    if (!VALID_STATUSES.includes(status as any)) {
      res.status(400).json({
        error: `Invalid status value: "${status}". Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    // Get old status first for the history log
    const { data: oldSub, error: fetchError } = await supabase
      .from('submissions')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !oldSub) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Update status
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (updateError) {
      res.status(500).json({ error: 'Failed to update status', details: updateError.message });
      return;
    }

    // Log history
    await supabase.from('submission_status_history').insert({
      submission_id: id,
      old_status: oldSub.status,
      new_status: status,
      actor_user_id: userId,
      note: 'Status updated by editor'
    });

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const assignReviewer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewer_id } = req.body;
    const userId = req.user?.id;

    if (!reviewer_id) {
      res.status(400).json({ error: 'reviewer_id is required' });
      return;
    }

    // 1. Insert review assignment
    const { data, error } = await supabase
      .from('review_assignments')
      .insert({
        submission_id: id,
        reviewer_id,
        status: 'assigned'
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to assign reviewer', details: error.message });
      return;
    }

    // ✅ FIX: Update submission status to IN_REVIEW after assignment
    // Previously this was missing, leaving articles stuck at PENDING_PRE_CHECK
    const { data: currentSub } = await supabase
      .from('submissions')
      .select('status')
      .eq('id', id)
      .single();

    await supabase
      .from('submissions')
      .update({ status: 'IN_REVIEW' })
      .eq('id', id);

    // Log the status change
    await supabase.from('submission_status_history').insert({
      submission_id: id,
      old_status: currentSub?.status || 'PENDING_PRE_CHECK',
      new_status: 'IN_REVIEW',
      actor_user_id: userId,
      note: `Reviewer assigned — submission moved to peer review`,
    });

    res.status(201).json({ message: 'Reviewer assigned successfully', data });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW: GET /api/editor/reviewers
// Returns all users with the 'reviewer' role for this journal
// Used by the "Assign Reviewer" dropdown in Articles.tsx
// ─────────────────────────────────────────────────────────────────────────────
export const getReviewers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Get journal_id from the editor's role (from authMiddleware roles array)
    const editorRoles = req.user?.roles || [];
    const editorRole = editorRoles.find(r => r.role === 'editor' || r.role === 'super_admin');

    let query = supabase
      .from('journal_members')
      .select('user_id, journal_id')
      .eq('journal_role', 'reviewer');

    // If editor has a specific journal, scope to that journal
    if (editorRole?.journal_id) {
      query = query.eq('journal_id', editorRole.journal_id);
    }

    const { data: members, error: membersError } = await query;

    if (membersError) {
      res.status(500).json({ error: 'Failed to fetch reviewers', details: membersError.message });
      return;
    }

    if (!members || members.length === 0) {
      res.status(200).json([]);
      return;
    }

    // 2. Fetch profiles for each reviewer to get their display name
    const reviewerUserIds = members.map((m: any) => m.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, name_surname, academic_email')
      .in('user_id', reviewerUserIds);

    if (profilesError) {
      console.warn('Failed to fetch reviewer profiles', profilesError);
    }

    // 3. Merge members with profiles
    const reviewers = members.map((member: any) => {
      const profile = (profiles || []).find((p: any) => p.user_id === member.user_id);
      return {
        id: member.user_id,
        name: profile?.name_surname || profile?.academic_email || member.user_id,
      };
    });

    res.status(200).json(reviewers);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};


export const getEditorArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, status, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('submissions')
      .select('*, submission_authors(*)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    query = query.range(offset, offset + limitNum - 1).order('created_at', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      res.status(500).json({ error: 'Failed to fetch articles', details: error.message });
      return;
    }

    res.status(200).json({
      data: data || [],
      total: count || 0,
      page: pageNum,
      totalPages: Math.ceil((count || 0) / limitNum)
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const updateArticleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    // Get old status first for the history log
    const { data: oldSub, error: fetchError } = await supabase
      .from('submissions')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !oldSub) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Update status
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (updateError) {
      res.status(500).json({ error: 'Failed to update status', details: updateError.message });
      return;
    }

    // Log history
    await supabase.from('submission_status_history').insert({
      submission_id: id,
      old_status: oldSub.status,
      new_status: status,
      actor_user_id: userId,
      note: 'Status updated by editor'
    });

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const assignReviewer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewer_id } = req.body;

    if (!reviewer_id) {
      res.status(400).json({ error: 'reviewer_id is required' });
      return;
    }

    const { data, error } = await supabase
      .from('review_assignments')
      .insert({
        submission_id: id,
        reviewer_id,
        status: 'assigned'
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to assign reviewer', details: error.message });
      return;
    }

    res.status(201).json({ message: 'Reviewer assigned successfully', data });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
