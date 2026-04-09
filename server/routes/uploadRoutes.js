import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// 1. Tell Multer where to save the files and what to name them
// 2. Update your storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    
    // Check if the directory exists. If not, create it automatically!
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir); 
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. Filter to make sure they only upload images
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

// 3. Initialize Multer
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. The actual route endpoint: POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  // When successful, send back the path to the file so React can display it
  res.send(`/${req.file.path.replace(/\\/g, '/')}`); 
});

export default router;