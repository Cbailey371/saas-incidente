const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder for uploads relative to the project root
    // Ensure this directory exists or is created before running the app
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    // e.g., fieldname-timestamp.ext
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Create the multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit (adjust as needed)
  fileFilter: (req, file, cb) => {
    // Allow only certain image file types
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) { return cb(null, true); }
    cb(new Error('Error: Only image files (jpeg, jpg, png, gif) are allowed!')); // Customize error message
  }
});

module.exports = upload;