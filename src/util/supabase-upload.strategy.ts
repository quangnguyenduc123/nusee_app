import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import { UploadStrategy } from './upload-strategy.interface';

@Injectable()
export class SupabaseUploadStrategy implements UploadStrategy {
  private supabase: SupabaseClient;
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
    );
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileName = `public/${file.originalname}`;
      const fileBuffer = file.buffer;

      const { error: uploadError, data: uploadResult } =
        await this.supabase.storage
          .from(process.env.SUPABASE_BUCKET_NAME)
          .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
          });

      if (uploadError) {
        throw new InternalServerErrorException(
          `Failed to upload file: ${uploadError.message}`,
        );
      }

      const { data: getPublicUrlResult } = await this.supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(fileName);

      return getPublicUrlResult.publicUrl;
    });

    const filePaths = await Promise.all(uploadPromises);
    return filePaths;
  }
}
