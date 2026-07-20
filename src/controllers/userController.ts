import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // If no profile yet, return empty object to not break the frontend
      res.status(200).json({ data: {} });
      return;
    }

    // Map DB columns to frontend fields
    const frontendData = {
      ...data,
      name: data.name_surname,
      email: data.academic_email,
      department: data.field,
      title_field: data.title,
      orcid: data.orcid_id,
    };

    res.status(200).json({ data: frontendData });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id, name, email, department, title_field, orcid, ...updates } = req.body;

    const allowedColumns = [
      'title', 'name_surname', 'academic_email', 'phone', 
      'institution', 'field', 'academic_interest', 'city', 
      'country', 'yoksis_id', 'orcid_id', 'iban'
    ];

    const cleanUpdates: any = {};
    
    // Map frontend fields to DB columns
    if (name !== undefined) cleanUpdates.name_surname = name;
    if (email !== undefined) cleanUpdates.academic_email = email;
    if (department !== undefined) cleanUpdates.field = department;
    if (title_field !== undefined) cleanUpdates.title = title_field;
    if (orcid !== undefined) cleanUpdates.orcid_id = orcid;

    for (const key of Object.keys(updates)) {
      if (allowedColumns.includes(key)) {
        cleanUpdates[key] = updates[key];
      }
    }

    // Ensure we don't try to upsert empty object if fields are completely missing, 
    // but the DB requires name_surname at minimum.

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, ...cleanUpdates })
      .select()
      .single();

    if (error) {
      console.error('[Update Profile Error]', error);
      res.status(500).json({ error: 'Failed to update profile', details: error.message });
      return;
    }

    res.status(200).json({ message: 'Profile updated successfully', data });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const getUserWorkspaces = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch memberships from journal_members
    const { data: memberships, error: memError } = await supabase
      .from('journal_members')
      .select('*, journals(name, slug)')
      .eq('user_id', userId);

    if (memError) {
      res.status(500).json({ error: 'Failed to fetch workspaces', details: memError.message });
      return;
    }

    const workspaces: any[] = [];

    // Always add a global Author workspace so users can submit articles
    workspaces.push({
      id: 'global-author',
      role: 'author',
      tenantName: 'Tüm Dergiler',
      tenantSlug: 'all',
      lastActive: 'Bugün',
      stat: 'Yazar Paneli'
    });

    // Give Demo User Super Admin access so they can test the admin panel
    if (userId === '9077a2da-0d48-4505-9989-b68ec3a5dba7') {
      workspaces.push({
        id: 'system-admin',
        role: 'super_admin',
        tenantName: 'Sistem Yönetimi',
        tenantSlug: 'admin',
        lastActive: 'Aktif',
        stat: 'Admin Paneli'
      });
    }

    if (memberships && memberships.length > 0) {
      memberships.forEach((m: any) => {
        if (m.journals) {
          workspaces.push({
            id: m.journal_id,
            role: m.journal_role,
            tenantName: m.journals.name,
            tenantSlug: m.journals.slug || 'journal',
            lastActive: 'Aktif',
            stat: 'Yönetim'
          });
        }
      });
    }

    res.status(200).json({ data: workspaces });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
