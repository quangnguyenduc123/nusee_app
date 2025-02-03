import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { FileUploadService } from 'src/util/file-upload';
import { LocalUploadStrategy } from 'src/util/local-upload.strategy';
import { SupabaseUploadStrategy } from 'src/util/supabase-upload.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    FileUploadService,
    LocalUploadStrategy,
    SupabaseUploadStrategy,
  ],
})
export class CategoryModule {}
