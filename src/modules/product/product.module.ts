import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './controllers';
import { Product } from './entities';
import { ProductService } from './services';
import { Category } from '../category/entities';
import { FileUploadService } from 'src/util/file-upload';
import { LocalUploadStrategy } from 'src/util/local-upload.strategy';
import { SupabaseUploadStrategy } from 'src/util/supabase-upload.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController],
  providers: [
    ProductService,
    FileUploadService,
    LocalUploadStrategy,
    SupabaseUploadStrategy,
  ],
})
export class ProductModule {}
