import {
  Controller,
  Get,
  Param,
  Query,
  Put,
  Body,
  Post,
  Delete,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '../services';
import { Product } from '../entities';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindAllProductsDto } from '../dto/find-all-product.dto';
import { FileUploadService } from 'src/util/file-upload';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/util/file-validation.pipe';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    description: 'Create Product DTO',
    type: CreateProductDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          name: 'Product 1',
          description: 'Description of Product 1',
          price: 100.0,
          agencyId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          name: 'Product 1',
          description: 'Description of Product 1',
          price: 100.0,
          images: [],
          agency: {
            id: 1,
            name: 'Agency 1',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(
    new FileValidationPipe({
      isOptional: false,
    }),
  )
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Product> {
    const strategyType = 'local';
    const imagePaths = images
      ? await this.fileUploadService.uploadFiles(images, strategyType)
      : [];

    return this.productService.create({
      ...createProductDto,
      images: imagePaths,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with search and filter' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [Product],
    examples: {
      example1: {
        summary: 'Example response',
        value: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Description of Product 1',
            price: 100.0,
            images: [],
            agency: {
              id: 1,
              name: 'Agency 1',
            },
          },
          {
            id: 2,
            name: 'Product 2',
            description: 'Description of Product 2',
            price: 200.0,
            images: [],
            agency: {
              id: 2,
              name: 'Agency 2',
            },
          },
        ],
      },
    },
  })
  async findAll(@Query() query: FindAllProductsDto): Promise<Product[]> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Product details',
    type: Product,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          name: 'Product 1',
          description: 'Description of Product 1',
          price: 100.0,
          images: [],
          agency: {
            id: 1,
            name: 'Agency 1',
          },
        },
      },
    },
  })
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({
    description: 'Update Product DTO',
    type: UpdateProductDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          name: 'Updated Product 1',
          description: 'Updated description of Product 1',
          price: 150.0,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          name: 'Updated Product 1',
          description: 'Updated description of Product 1',
          price: 150.0,
          images: [],
          agency: {
            id: 1,
            name: 'Agency 1',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(
    new FileValidationPipe({
      isOptional: true,
    }),
  )
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<Product> {
    let imagePaths: string[] = [];
    const strategyType = 'local';
    if (images && images.length > 0) {
      imagePaths = await this.fileUploadService.uploadFiles(
        images,
        strategyType,
      );
    }

    const updatedProductDto = {
      ...updateProductDto,
      ...(imagePaths.length > 0 && { images: imagePaths }),
      ...(updateProductDto.images &&
        updateProductDto.images.length === 0 && { images: [] }),
    };

    return this.productService.update(id, updatedProductDto);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of related products',
    type: [Product],
    examples: {
      example1: {
        summary: 'Example response',
        value: [
          {
            id: 2,
            name: 'Related Product 1',
            description: 'Description of Related Product 1',
            price: 120.0,
            images: [],
            agency: {
              id: 1,
              name: 'Agency 1',
            },
          },
          {
            id: 3,
            name: 'Related Product 2',
            description: 'Description of Related Product 2',
            price: 130.0,
            images: [],
            agency: {
              id: 1,
              name: 'Agency 1',
            },
          },
        ],
      },
    },
  })
  async findRelatedProducts(@Param('id') id: number): Promise<Product[]> {
    const product = await this.productService.findOne(id);
    return this.productService.findRelatedProducts(product.category.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          message: 'Product with ID 1 has been successfully deleted.',
        },
      },
    },
  })
  async remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
