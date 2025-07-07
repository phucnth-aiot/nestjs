import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file: Express.Multer.File, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return new BadRequestException('Invalid file type');
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
