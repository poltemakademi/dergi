import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';

// Route Imports
import authorRoutes from './routes/authorRoutes';
import editorRoutes from './routes/editorRoutes';
import reviewerRoutes from './routes/reviewerRoutes';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';

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

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running smoothly.' });
});

// 2. Route Mounting
app.use('/api/author', authorRoutes);
app.use('/api/editor', editorRoutes);
app.use('/api/reviewer', reviewerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
// Note: Issue routes (like /api/editor/issues/create) are already mounted inside editorRoutes.

// Handle 404 - Route Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

// 3. Global Error Handling
// This must be the last middleware in the stack
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
