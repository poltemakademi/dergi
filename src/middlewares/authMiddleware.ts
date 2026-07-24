import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
    roles?: {
      journal_id: string;
      role: string;
    }[];
  };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // FOR DEVELOPMENT ONLY: Allow RoleSimulator and demo tokens
    if (token.startsWith('demo-') && process.env.NODE_ENV !== 'production') {
      let role = 'author';
      let email = 'author@demo.com';
      let id = '00000000-0000-0000-0000-000000000001';

      if (token.includes('editor') && !token.includes('layout')) {
        role = 'editor';
        email = 'editor@demo.com';
        id = '00000000-0000-0000-0000-000000000002';
      } else if (token.includes('reviewer')) {
        role = 'reviewer';
        email = 'reviewer@demo.com';
        id = '00000000-0000-0000-0000-000000000003';
      } else if (token.includes('layout')) {
        role = 'layout_editor';
        email = 'layout@demo.com';
        id = '00000000-0000-0000-0000-000000000004';
      } else if (token.includes('super_admin') || token.includes('admin')) {
        role = 'super_admin';
        email = 'super_admin@demo.com';
        id = '00000000-0000-0000-0000-000000000005';
      }

      req.user = {
        id: id,
        email: email,
        roles: [{ journal_id: 'mock-journal', role: role }]
      };
      return next();
    }

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      res.status(401).json({ error: 'Invalid or expired token', details: authError?.message });
      return;
    }

    // Fetch user roles from journal_members
    const { data: membersData, error: membersError } = await supabase
      .from('journal_members')
      .select('journal_id, journal_role')
      .eq('user_id', user.id);

    if (membersError) {
      res.status(500).json({ error: 'Failed to fetch user roles' });
      return;
    }

    const roles = membersData?.map((m: any) => ({
      journal_id: m.journal_id,
      role: m.journal_role
    })) || [];

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      roles
    };

    next();
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error during authentication', details: err.message });
  }
};
