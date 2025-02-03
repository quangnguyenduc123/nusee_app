import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartController } from './controllers';
import { Cart, CartItem } from './entities';
import { CartService } from './services';
import { Agency } from '../agency/entities';
import { Product } from '../product/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Agency, Product])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
