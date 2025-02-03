import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { CreateCartDto } from '../dto/create-cart.dto';
import { Product } from '../../product/entities';
import { Agency } from '../../agency/entities';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async getPurchaseHistory(agencyId: number): Promise<Cart[]> {
    console.log(`Agency ID: ${agencyId}`);
    return this.cartRepository.find({
      where: { agency: { id: agencyId } },
      relations: ['items', 'items.product'],
    });
  }

  async getOrderDetails(orderId: number): Promise<Cart> {
    const order = await this.cartRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  async createCart(createCartDto: CreateCartDto): Promise<Cart> {
    const { agencyId } = createCartDto;

    const agency = await this.agencyRepository.findOne({
      where: { id: agencyId },
    });
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${agencyId} not found`);
    }

    const cart = new Cart();
    cart.agency = agency;

    return this.cartRepository.save(cart);
  }

  async addCartItem(addCartItemDto: AddCartItemDto): Promise<CartItem> {
    const { cartId, productId, quantity } = addCartItemDto;

    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const cartItem = new CartItem();
    cartItem.cart = cart;
    cartItem.product = product;
    cartItem.quantity = quantity;
    cartItem.price = product.original_price * quantity;

    return this.cartItemRepository.save(cartItem);
  }

  async updateCartItem(
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const { cartItemId, quantity } = updateCartItemDto;

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['product'],
    });
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID ${cartItemId} not found`);
    }

    cartItem.quantity = quantity;
    cartItem.price = cartItem.product.original_price * quantity;

    return this.cartItemRepository.save(cartItem);
  }
}
