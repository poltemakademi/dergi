import type { Response } from 'express';
import { supabase } from '../config/supabase';
import type { AuthRequest } from '../middlewares/authMiddleware';

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
      bio: data.academic_interest,
      country: data.country,
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

    const { id, name, email, department, title_field, orcid, bio, country, ...updates } = req.body;

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
    if (bio !== undefined) cleanUpdates.academic_interest = bio;
    if (country !== undefined) cleanUpdates.country = country;

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

    // 1. Fetch memberships from journal_members safely
    let memberships: any[] = [];
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    if (isUuid) {
      const { data: memData, error: memError } = await supabase
        .from('journal_members')
        .select('*, journals(name)')
        .eq('user_id', userId);

      if (!memError && memData) {
        memberships = memData;
      } else if (memError) {
        console.warn('[getUserWorkspaces] Supabase warning:', memError.message);
      }
    }

    const workspaces: any[] = [];

    // Extract role strings properly whether roles is array of strings or objects
    const rawRoles = (req.user as any)?.roles || [];
    const userRoles: string[] = Array.isArray(rawRoles)
      ? rawRoles.map((r: any) => (typeof r === 'string' ? r : r.role))
      : [];
    const userEmail = ((req.user as any)?.email || '').trim().toLowerCase();
    const userStr = JSON.stringify(req.user || {}).toLowerCase();

    // --- BULLETPROOF DEMO ACCOUNT OVERRIDES ---
    if (userStr.includes('editor@demo.com')) {
      res.status(200).json({
        data: [
          { id: 'global-author', role: 'author', tenantName: 'Yazar Portalı', tenantSlug: 'all', lastActive: 'Bugün', stat: 'Yazar Paneli' },
          { id: 'global-editor', role: 'editor', tenantName: 'Editör Portalı', tenantSlug: 'all', lastActive: 'Aktif', stat: 'Editör Paneli' },
          { id: 'global-reviewer', role: 'reviewer', tenantName: 'Hakem Portalı', tenantSlug: 'all', lastActive: 'Aktif', stat: 'Hakem Paneli' }
        ]
      });
      return;
    }

    if (userStr.includes('reviewer@demo.com')) {
      res.status(200).json({
        data: [
          { id: 'global-author', role: 'author', tenantName: 'Yazar Portalı', tenantSlug: 'all', lastActive: 'Bugün', stat: 'Yazar Paneli' },
          { id: 'global-reviewer', role: 'reviewer', tenantName: 'Hakem Portalı', tenantSlug: 'all', lastActive: 'Aktif', stat: 'Hakem Paneli' }
        ]
      });
      return;
    }

    if (userStr.includes('layout@demo.com')) {
      res.status(200).json({
        data: [
          { id: 'global-author', role: 'author', tenantName: 'Yazar Portalı', tenantSlug: 'all', lastActive: 'Bugün', stat: 'Yazar Paneli' },
          { id: 'global-layout', role: 'layout_editor', tenantName: 'Mizanpaj Portalı', tenantSlug: 'all', lastActive: 'Aktif', stat: 'Mizanpaj Paneli' }
        ]
      });
      return;
    }

    if (userStr.includes('super_admin@demo.com')) {
      res.status(200).json({
        data: [
          { id: 'global-author', role: 'author', tenantName: 'Yazar Portalı', tenantSlug: 'all', lastActive: 'Bugün', stat: 'Yazar Paneli' },
          { id: 'system-admin', role: 'super_admin', tenantName: 'Sistem Yönetimi', tenantSlug: 'admin', lastActive: 'Aktif', stat: 'Admin Paneli' }
        ]
      });
      return;
    }
    // ------------------------------------------

    // Always add Author workspace so users can submit articles
    workspaces.push({
      id: 'global-author',
      role: 'author',
      tenantName: 'Yazar Portalı',
      tenantSlug: 'all',
      lastActive: 'Bugün',
      stat: 'Yazar Paneli'
    });

    // Check Reviewer role capabilities
    const hasReviewerRole =
      userRoles.includes('reviewer') ||
      userEmail === 'reviewer@demo.com' ||
      userRoles.includes('super_admin') ||
      userEmail === 'super_admin@demo.com' ||
      userRoles.includes('editor') ||
      userEmail === 'editor@demo.com' ||
      (memberships && memberships.some((m: any) => m.journal_role === 'reviewer' || m.journal_role === 'editor'));

    if (hasReviewerRole) {
      workspaces.push({
        id: 'global-reviewer',
        role: 'reviewer',
        tenantName: 'Hakem Portalı',
        tenantSlug: 'all',
        lastActive: 'Aktif',
        stat: 'Hakem Paneli'
      });
    }

    // Check Editor role capabilities
    const hasEditorRole =
      userRoles.includes('editor') ||
      userEmail === 'editor@demo.com' ||
      userRoles.includes('super_admin') ||
      userEmail === 'super_admin@demo.com' ||
      (memberships && memberships.some((m: any) => m.journal_role === 'editor'));

    if (hasEditorRole) {
      workspaces.push({
        id: 'global-editor',
        role: 'editor',
        tenantName: 'Editör Portalı',
        tenantSlug: 'all',
        lastActive: 'Aktif',
        stat: 'Editör Paneli'
      });
    }

    const hasLayoutEditorRole =
      userRoles.includes('layout_editor') ||
      userEmail === 'layout@demo.com' ||
      userRoles.includes('super_admin') ||
      userEmail === 'super_admin@demo.com' ||
      (memberships && memberships.some((m: any) => m.journal_role === 'layout_editor'));

    if (hasLayoutEditorRole) {
      workspaces.push({
        id: 'global-layout',
        role: 'layout_editor',
        tenantName: 'Mizanpaj Portalı',
        tenantSlug: 'all',
        lastActive: 'Aktif',
        stat: 'Mizanpaj Paneli'
      });
    }

    const hasSectionEditorRole =
      userRoles.includes('section_editor') ||
      userRoles.includes('super_admin') ||
      userEmail === 'super_admin@demo.com' ||
      (memberships && memberships.some((m: any) => m.journal_role === 'section_editor'));

    if (hasSectionEditorRole) {
      workspaces.push({
        id: 'global-section',
        role: 'section_editor',
        tenantName: 'Alan Editörü Portalı',
        tenantSlug: 'all',
        lastActive: 'Aktif',
        stat: 'Alan Editörü'
      });
    }

    const hasCopyeditorRole =
      userRoles.includes('copyeditor') ||
      userRoles.includes('super_admin') ||
      userEmail === 'super_admin@demo.com' ||
      (memberships && memberships.some((m: any) => m.journal_role === 'copyeditor'));

    if (hasCopyeditorRole) {
      workspaces.push({
        id: 'global-copy',
        role: 'copyeditor',
        tenantName: 'Dil Editörü Portalı',
        tenantSlug: 'all',
        lastActive: 'Aktif',
        stat: 'Dil Editörü'
      });
    }

    const hasSuperAdminRole = 
      userRoles.includes('super_admin') ||
      userEmail === 'super_admin@demo.com' ||
      (memberships && memberships.some((m: any) => m.journal_role === 'super_admin'));

    if (hasSuperAdminRole) {
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

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).json({ data: workspaces });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
