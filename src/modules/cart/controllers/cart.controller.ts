import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { Cart, CartItem } from '../entities';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('purchase-history')
  @ApiOperation({ summary: 'Get purchase history' })
  @ApiQuery({ name: 'agencyId', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of purchase history',
    type: [Cart],
    examples: {
      example1: {
        summary: 'Example response',
        value: [
          {
            id: 1,
            created_at: '2025-02-02T09:24:16.000Z',
            updated_at: '2025-02-02T09:24:16.000Z',
            items: [
              {
                id: 1,
                quantity: 2,
                price: 50.0,
                product: {
                  id: 1,
                  name: 'Product 1',
                  price: 25.0,
                },
              },
            ],
          },
        ],
      },
    },
  })
  async getPurchaseHistory(
    @Query('agencyId') agencyId: number,
  ): Promise<Cart[]> {
    return this.cartService.getPurchaseHistory(agencyId);
  }

  @Get('order-details/:orderId')
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'orderId', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Order details',
    type: Cart,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          created_at: '2025-02-02T09:24:16.000Z',
          updated_at: '2025-02-02T09:24:16.000Z',
          items: [
            {
              id: 1,
              quantity: 2,
              price: 50.0,
              product: {
                id: 1,
                name: 'Product 1',
                price: 25.0,
              },
            },
          ],
        },
      },
    },
  })
  async getOrderDetails(@Param('orderId') orderId: number): Promise<Cart> {
    return this.cartService.getOrderDetails(orderId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiBody({
    description: 'Create Cart DTO',
    type: CreateCartDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          agencyId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The cart has been successfully created.',
    type: Cart,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          created_at: '2025-02-02T09:24:16.000Z',
          updated_at: '2025-02-02T09:24:16.000Z',
          agency: {
            id: 1,
            name: 'Agency 1',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The cart has been successfully created.',
    type: Cart,
  })
  async createCart(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartService.createCart(createCartDto);
  }

  @Post('add-item')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({
    description: 'Add Cart Item DTO',
    type: AddCartItemDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          cartId: 1,
          productId: 1,
          quantity: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully added to the cart.',
    type: CartItem,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          quantity: 2,
          price: 50.0,
          cart: {
            id: 1,
          },
          product: {
            id: 1,
            name: 'Product 1',
            price: 25.0,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully added to the cart.',
    type: CartItem,
  })
  async addCartItem(@Body() addCartItemDto: AddCartItemDto): Promise<CartItem> {
    return this.cartService.addCartItem(addCartItemDto);
  }

  @Put('update-item')
  @ApiOperation({ summary: 'Update item in cart' })
  @ApiBody({
    description: 'Update Cart Item DTO',
    type: UpdateCartItemDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          cartItemId: 1,
          quantity: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated in the cart.',
    type: CartItem,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          quantity: 3,
          price: 75.0,
          cart: {
            id: 1,
          },
          product: {
            id: 1,
            name: 'Product 1',
            price: 25.0,
          },
        },
      },
    },
  })
  async updateCartItem(
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return this.cartService.updateCartItem(updateCartItemDto);
  }
}
