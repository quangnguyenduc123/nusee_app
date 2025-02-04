import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import typeorm from './config/typeorm';
import { AgencyModule } from './modules/agency/agency.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { ProductModule } from './modules/product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { ConfigServerModule } from './modules/config/config-server.module';
import { LoggerModule } from './logger/logger.module';
import { PostModule } from './modules/post/post.module';

dotenv.config();
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from the uploads directory
      serveRoot: '/uploads', // Serve files under the /uploads route
    }),
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    LoggerModule,
    AgencyModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    CartModule,
    ConfigServerModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
