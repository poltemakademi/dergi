import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';

// Route Imports
import authorRoutes from './routes/authorRoutes';
import editorRoutes from './routes/editorRoutes';
import reviewerRoutes from './routes/reviewerRoutes';
import layoutRoutes from './routes/layoutRoutes';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';
import messageRoutes from './routes/messageRoutes';
import publicRoutes from './routes/publicRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. App Initialization & Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check Route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running smoothly.' });
});

// 2. Route Mounting
app.use('/api/author', authorRoutes);
app.use('/api/editor', editorRoutes);
app.use('/api/reviewer', reviewerRoutes);
app.use('/api/layout', layoutRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/public', publicRoutes);
// Note: Issue routes (like /api/editor/issues/create) are already mounted inside editorRoutes.

// Mock Journal Settings (Phase 6 placeholder)
app.get('/api/journal/settings', (_req: Request, res: Response) => {
  res.status(200).json({
    journalName: 'Novai Journal of Academic Research',
    abbreviation: 'NJAR',
    issn: '1234-5678',
    eIssn: '8765-4321',
    aimsScope: 'Our journal aims to publish high-quality research...',
    crossrefPrefix: '10.1234',
    doajKey: 'dummy-doaj-key'
  });
});

app.put('/api/journal/settings', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Settings saved successfully', data: req.body });
});

// Handle 404 - Route Not Found
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

// 3. Global Error Handling
// This must be the last middleware in the stack
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 [Global Error Handler]:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 4. Server Startup
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  // Verify Supabase DB connection via config
  if (supabase) {
    console.log('✅ Supabase Client Initialized via Service Role Key.');
  } else {
    console.warn('⚠️ Supabase Client failed to initialize.');
  }
});
