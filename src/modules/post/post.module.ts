import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { FileUploadService } from 'src/util/file-upload';
import { LocalUploadStrategy } from 'src/util/local-upload.strategy';
import { SupabaseUploadStrategy } from 'src/util/supabase-upload.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [
    PostService,
    FileUploadService,
    LocalUploadStrategy,
    SupabaseUploadStrategy,
  ],
})
export class PostModule {}
