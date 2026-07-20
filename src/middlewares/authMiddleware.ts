import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
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
    
    console.log('[AuthMiddleware] Received Token:', token);
    console.log('[AuthMiddleware] NODE_ENV:', process.env.NODE_ENV);

    // FOR DEVELOPMENT ONLY: Allow RoleSimulator mock token
    if (token.startsWith('demo-') && process.env.NODE_ENV !== 'production') {
      req.user = {
        id: '9077a2da-0d48-4505-9989-b68ec3a5dba7',
        email: 'demo@example.com',
        roles: [{ journal_id: 'mock-journal', role: 'author' }]
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
