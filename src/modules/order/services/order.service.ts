import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FindOrdersDto } from '../dto/find-orders.dto';
import { UpdateOrderProductsDto } from '../dto/update-order-products.dto';
import { OrderDetail } from '../entities/order-detail.entity';
import { Product } from '../../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async findAll(query: FindOrdersDto): Promise<Order[]> {
    const qb = this.orderRepository.createQueryBuilder('order');

    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }

    if (query.agent_id) {
      qb.andWhere('order.agent_id = :agent_id', { agent_id: query.agent_id });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async updateOrderProducts(
    id: number,
    updateOrderProductsDto: UpdateOrderProductsDto,
  ): Promise<Order> {
    const order = await this.findOne(id);
    await this.orderDetailRepository.delete({ order });

    const orderDetails = updateOrderProductsDto.orderDetails.map((detail) => {
      const orderDetail = new OrderDetail();
      orderDetail.order = order;
      orderDetail.product = { id: detail.product_id } as Product;
      orderDetail.quantity = detail.quantity;
      orderDetail.price = detail.price;
      return orderDetail;
    });

    await this.orderDetailRepository.save(orderDetails);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
