import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  // Destination folder to save the image
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  // Generate unique filename for each image
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, callback) => {
  // Only accept jpeg or png
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type.'), false);   // Throw an error and ignore the file
  }
};

export const upload = multer({
  storage: storage,
  limits: {fileSize: 1024 * 1024 * 5},
  fileFilter: fileFilter
});
