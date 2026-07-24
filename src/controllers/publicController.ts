import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getPublishedContent = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Fetch submissions that are PUBLISHED
    const { data: submissions, error: subError } = await supabase
      .from('submissions')
      .select(`
        id,
        title,
        status,
        created_at,
        journal_id
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (subError) {
      res.status(500).json({ error: 'Failed to fetch published articles', details: subError.message });
      return;
    }

    const subIds = (submissions || []).map((s: any) => s.id);
    let authorsData: any[] = [];
    let issueData: any[] = [];
    let issuesData: any[] = [];

    if (subIds.length > 0) {
      // Fetch authors for these submissions
      const { data: authors } = await supabase
        .from('submission_authors')
        .select('*')
        .in('submission_id', subIds);
      authorsData = authors || [];

      // Fetch issue_articles links
      const { data: ia } = await supabase
        .from('issue_articles')
        .select('*')
        .in('submission_id', subIds);
      issueData = ia || [];

      if (issueData.length > 0) {
        const issueIds = [...new Set(issueData.map((i: any) => i.issue_id))];
        const { data: issues } = await supabase
          .from('issues')
          .select('*')
          .in('id', issueIds);
        issuesData = issues || [];
      }
    }

    // Assemble the data
    const formattedArticles = (submissions || []).map((sub: any) => {
      const subAuthors = authorsData.filter((a: any) => a.submission_id === sub.id);
      const authorStr = subAuthors.map((a: any) => `${a.first_name} ${a.last_name}`).join(', ');

      const link = issueData.find((i: any) => i.submission_id === sub.id);
      let issue = null;
      if (link) {
        issue = issuesData.find((i: any) => i.id === link.issue_id);
      }

      return {
        id: sub.id,
        title: sub.title,
        author: authorStr || 'Unknown Author',
        abstract: 'Abstract not available publicly yet.',
        pages: '1-10', // Mocked since we don't store pages yet
        doi: `10.xxxx/${sub.id.substring(0,8)}`, // Mocked DOI
        journal_id: sub.journal_id,
        issue: issue ? {
          volume: issue.issue_volume,
          number: issue.issue_number,
          title: issue.issue_title_english
        } : null,
        created_at: sub.created_at
      };
    });

    res.status(200).json({ data: { articles: formattedArticles } });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
