import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities';
import { Category } from '../../category/entities';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindAllProductsDto } from '../dto/find-all-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.category_id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: FindAllProductsDto): Promise<Product[]> {
    const qb = this.productRepository.createQueryBuilder('product');

    if (query.name) {
      qb.andWhere('product.name LIKE :name', { name: `%${query.name}%` });
    }

    if (query.minPrice) {
      qb.andWhere('product.sale_price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice) {
      qb.andWhere('product.sale_price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.category_id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }

    if (updateProductDto.images && updateProductDto.images.length === 0) {
      product.images = [];
    } else if (updateProductDto.images) {
      product.images = updateProductDto.images;
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async findRelatedProducts(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { id: categoryId } },
    });
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(product);
  }
}
