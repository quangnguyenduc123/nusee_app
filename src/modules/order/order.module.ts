import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { Order, OrderDetail } from './entities';
import { Product } from '../product/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Product])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
