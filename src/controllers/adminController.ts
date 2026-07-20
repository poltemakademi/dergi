import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getJournals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch journals', details: error.message });
      return;
    }

    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const createJournal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Journal name is required' });
      return;
    }

    // Since our journals table only has id, name, created_at, we just insert name.
    // If the DB schema updates to include slug/description, they will be saved too.
    const payload: any = { name };
    if (slug) payload.slug = slug;
    if (description) payload.description = description;

    const { data, error } = await supabase
      .from('journals')
      .insert(payload)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to create journal', details: error.message });
      return;
    }

    res.status(201).json({ message: 'Journal created successfully', data });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch users', details: error.message });
      return;
    }

    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
