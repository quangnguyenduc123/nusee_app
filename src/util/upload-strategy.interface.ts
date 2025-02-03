export interface UploadStrategy {
  uploadFiles(files: Express.Multer.File[]): Promise<string[]>;
}
