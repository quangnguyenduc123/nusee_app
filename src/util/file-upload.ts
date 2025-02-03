import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadStrategy } from './upload-strategy.interface';
import { LocalUploadStrategy } from './local-upload.strategy';

@Injectable()
export class FileUploadService {
  private strategies: { [key: string]: UploadStrategy };

  constructor(private readonly localUploadStrategy: LocalUploadStrategy) {
    this.strategies = {
      local: this.localUploadStrategy,
    };
  }

  async uploadFiles(
    files: Express.Multer.File[],
    strategyType: string,
  ): Promise<string[]> {
    const strategy = this.strategies[strategyType.toLowerCase()];
    if (!strategy) {
      throw new InternalServerErrorException(
        `Upload strategy ${strategyType} not found`,
      );
    }
    return strategy.uploadFiles(files);
  }
}
