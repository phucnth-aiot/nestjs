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
  fileFilter: (req, file, cb) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return cb(new BadRequestException('Invalid file type'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
