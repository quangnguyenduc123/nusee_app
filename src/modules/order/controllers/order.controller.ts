import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FindOrdersDto } from '../dto/find-orders.dto';
import { UpdateOrderProductsDto } from '../dto/update-order-products.dto';
import { Order } from '../entities/order.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    description: 'Create Order DTO',
    type: CreateOrderDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          agencyId: 1,
          products: [
            {
              productId: 1,
              quantity: 2,
            },
            {
              productId: 2,
              quantity: 1,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: Order,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          agency: {
            id: 1,
            name: 'Agency 1',
          },
          products: [
            {
              id: 1,
              name: 'Product 1',
              price: 100.0,
              quantity: 2,
            },
            {
              id: 2,
              name: 'Product 2',
              price: 200.0,
              quantity: 1,
            },
          ],
          total: 400.0,
          status: 'Pending',
        },
      },
    },
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with search and filter' })
  @ApiQuery({
    name: 'agencyId',
    required: false,
    description: 'Filter orders by agency ID',
    example: 1,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter orders by status',
    example: 'Pending',
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: [Order],
    examples: {
      example1: {
        summary: 'Example response',
        value: [
          {
            id: 1,
            agency: {
              id: 1,
              name: 'Agency 1',
            },
            products: [
              {
                id: 1,
                name: 'Product 1',
                price: 100.0,
                quantity: 2,
              },
              {
                id: 2,
                name: 'Product 2',
                price: 200.0,
                quantity: 1,
              },
            ],
            total: 400.0,
            status: 'Pending',
          },
          {
            id: 2,
            agency: {
              id: 2,
              name: 'Agency 2',
            },
            products: [
              {
                id: 3,
                name: 'Product 3',
                price: 150.0,
                quantity: 1,
              },
              {
                id: 4,
                name: 'Product 4',
                price: 250.0,
                quantity: 2,
              },
            ],
            total: 650.0,
            status: 'Shipped',
          },
        ],
      },
    },
  })
  async findAll(@Query() query: FindOrdersDto): Promise<Order[]> {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Order details',
    type: Order,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          agency: {
            id: 1,
            name: 'Agency 1',
          },
          products: [
            {
              id: 1,
              name: 'Product 1',
              price: 100.0,
              quantity: 2,
            },
            {
              id: 2,
              name: 'Product 2',
              price: 200.0,
              quantity: 1,
            },
          ],
          total: 400.0,
          status: 'Pending',
        },
      },
    },
  })
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({
    description: 'Update Order DTO',
    type: UpdateOrderDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          status: 'Shipped',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    type: Order,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          agency: {
            id: 1,
            name: 'Agency 1',
          },
          products: [
            {
              id: 1,
              name: 'Product 1',
              price: 100.0,
              quantity: 2,
            },
            {
              id: 2,
              name: 'Product 2',
              price: 200.0,
              quantity: 1,
            },
          ],
          total: 400.0,
          status: 'Shipped',
        },
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Put(':id/products')
  @ApiOperation({ summary: 'Update products in an order' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({
    description: 'Update Order Products DTO',
    type: UpdateOrderProductsDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          products: [
            {
              productId: 1,
              quantity: 3,
            },
            {
              productId: 2,
              quantity: 2,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The products in the order have been successfully updated.',
    type: Order,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          agency: {
            id: 1,
            name: 'Agency 1',
          },
          products: [
            {
              id: 1,
              name: 'Product 1',
              price: 100.0,
              quantity: 3,
            },
            {
              id: 2,
              name: 'Product 2',
              price: 200.0,
              quantity: 2,
            },
          ],
          total: 700.0,
          status: 'Pending',
        },
      },
    },
  })
  async updateOrderProducts(
    @Param('id') id: number,
    @Body() updateOrderProductsDto: UpdateOrderProductsDto,
  ): Promise<Order> {
    return this.orderService.updateOrderProducts(id, updateOrderProductsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 204,
    description: 'The order has been successfully deleted.',
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          message: 'Order with ID 1 has been successfully deleted.',
        },
      },
    },
  })
  async remove(@Param('id') id: number): Promise<void> {
    return this.orderService.remove(id);
  }
}
