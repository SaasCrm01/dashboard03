// src/middleware/uploadMiddleware.ts
import multer from 'multer';
import path from 'path';

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Define o destino em public/uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome único para evitar conflitos
  }
});

const upload = multer({ storage });
export const uploadMiddleware = upload.single('photo'); // Usando `photo` como campo do arquivo
