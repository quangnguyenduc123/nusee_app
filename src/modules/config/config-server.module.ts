import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from 'src/util/file-upload';
import { LocalUploadStrategy } from 'src/util/local-upload.strategy';
import { SupabaseUploadStrategy } from 'src/util/supabase-upload.strategy';
import { Config } from './entities/config.entity';
import { ConfigServerController } from './controllers/config-server.controller';
import { ConfigServerService } from './services/config-server.service';

@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  controllers: [ConfigServerController],
  providers: [
    ConfigServerService,
    FileUploadService,
    LocalUploadStrategy,
    SupabaseUploadStrategy,
  ],
})
export class ConfigServerModule {}
