import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface FileValidationPipeOptions {
  isOptional?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly isOptional: boolean;

  constructor(options: FileValidationPipeOptions = { isOptional: false }) {
    this.isOptional = options.isOptional || false;
  }

  transform(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      if (this.isOptional) {
        return files;
      }
      throw new BadRequestException('No files uploaded');
    }

    if (!Array.isArray(files)) {
      return files;
    }

    for (const file of files) {
      // Validate file type
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        throw new BadRequestException(
          `File ${file.originalname} is not an image`,
        );
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException(`File ${file.originalname} is too large`);
      }
    }

    return files;
  }
}
