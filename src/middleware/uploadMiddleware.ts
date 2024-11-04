// src/middleware/uploadMiddleware.ts

import multer from 'multer';
import path from 'path';

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Define a pasta de destino como public/uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Define o nome do arquivo
  }
});

const upload = multer({ storage });

// Exporta o middleware de upload
export const uploadMiddleware = upload.single('photo');
