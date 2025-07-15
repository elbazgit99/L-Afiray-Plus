import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists with absolute path
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    
    // Determine file type based on field name or route
    let prefix = 'file';
    if (file.fieldname === 'profileImage') {
      prefix = 'profile';
    } else if (file.fieldname === 'imageFile') {
      prefix = 'carpart';
    }
    
    const filename = `${prefix}-${uniqueSuffix}${fileExtension}`;
    console.log('Saving file:', filename, 'to:', uploadsDir);
    cb(null, filename);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (file.mimetype.startsWith('image/')) {
    console.log('File accepted:', file.originalname, 'Type:', file.mimetype);
    cb(null, true);
  } else {
    console.log('File rejected:', file.originalname, 'Type:', file.mimetype);
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload; 