import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { Express } from 'express';

@Injectable()
export class FileService {
  private readonly allowerExt: string[] = ['.jpg', '.jpeg', '.pdf'];
  private readonly maxSize = 5 * 1024 * 1024;
  private readonly uploadPath = './uploads';

  async uploadFile(
    entityName: string,
    entityId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded!');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer is empty!');
    }

    const fileExt = extname(file.originalname).toLowerCase();

    if (!this.allowerExt.includes(fileExt)) {
      throw new BadRequestException('Invalid file type!');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException('File size exceeds 5MB!');
    }

    const newName = `${entityName}-${entityId}-${Date.now()}${fileExt}`;
    await fs.mkdir(this.uploadPath, { recursive: true });
    await fs.writeFile(`${this.uploadPath}/${newName}`, file.buffer);

    return newName;
  }
}
