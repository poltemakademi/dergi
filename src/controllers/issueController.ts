import type { Response } from 'express';
import { supabase } from '../config/supabase';
import type { AuthRequest } from '../middlewares/authMiddleware';

export const createIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { journal_id, volume, number, article_ids, title } = req.body;

    if (!volume || !number || !article_ids || !Array.isArray(article_ids)) {
      res.status(400).json({ error: 'Missing required fields or article_ids is not an array' });
      return;
    }

    let jId = journal_id;
    if (!jId) {
      const { data: journal } = await supabase.from('journals').select('id').limit(1).single();
      jId = journal?.id;
    }

    if (!jId) {
       res.status(400).json({ error: 'No journal found in DB' });
       return;
    }

    // 1. Insert into issues table
    const { data: newIssue, error: issueError } = await supabase
      .from('issues')
      .insert({
        journal_id: jId,
        issue_volume: volume,
        issue_number: number,
        issue_title_english: title,
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (issueError || !newIssue) {
      res.status(500).json({ error: 'Failed to create issue', details: issueError?.message });
      return;
    }

    // 2. Loop and insert into issue_articles
    const issueArticles = article_ids.map((subId, index) => ({
      issue_id: newIssue.id,
      submission_id: subId,
      sort_order: index + 1
    }));

    if (issueArticles.length > 0) {
      const { error: iaError } = await supabase
        .from('issue_articles')
        .insert(issueArticles);

      if (iaError) {
        console.warn('Failed to link articles to issue', iaError);
      }

      // 3. Update status of these submissions to PUBLISHED
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ status: 'PUBLISHED' })
        .in('id', article_ids);

      if (updateError) {
        console.warn('Failed to update submissions to PUBLISHED', updateError);
      }
    }

    res.status(201).json({ message: 'Issue published successfully', data: newIssue });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
