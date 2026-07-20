import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

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
