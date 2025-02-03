import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UploadStrategy } from './upload-strategy.interface';

@Injectable()
export class LocalUploadStrategy implements UploadStrategy {
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');

  constructor() {
    // Ensure the upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const filePaths: string[] = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      filePaths.push(`${fileName}`);
    }
    return filePaths;
  }
}
