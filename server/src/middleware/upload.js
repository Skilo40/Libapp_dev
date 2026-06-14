import multer from 'multer';
import path from 'path';

// Налаштування для збереження файлів в пам'ять
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Дозволити тільки зображення
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Дозволені тільки зображення (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
