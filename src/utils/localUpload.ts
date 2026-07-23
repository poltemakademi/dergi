import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Base uploads directory relative to project root
const UPLOADS_DIR = path.join(process.cwd(), 'uploads/manuscripts');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    // Unique filename: timestamp-originalName
    // We sanitize the original name to avoid issues with spaces or special characters
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}`);
  }
});

// Create the multer instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB max file size
  }
});
