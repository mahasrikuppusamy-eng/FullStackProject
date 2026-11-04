import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure local uploads directory exists if used
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

// Memory storage is ideal for multimodal Gemini processing and Cloudinary streaming
const memoryStorage = multer.memoryStorage();

export const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are supported'));
    }
  },
});

export default uploadMemory;
