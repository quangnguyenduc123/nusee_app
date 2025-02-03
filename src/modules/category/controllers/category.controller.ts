import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FileValidationPipe } from 'src/util/file-validation.pipe';
import { FileUploadService } from 'src/util/file-upload';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [Category],
  })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({ status: 200, description: 'Category details', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(new FileValidationPipe())
  @ApiOperation({ summary: 'Create a new category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Category metadata and image files',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Electronics' },
        description: { type: 'string', example: 'All electronic items' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category created', type: Category })
  async create(
    @Body() categoryData: CreateCategoryDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Category> {
    // Upload files and get their paths
    const imagePaths = images
      ? await this.fileUploadService.uploadFiles(images, 'local')
      : [];

    // Merge the DTO data with the file paths
    const dataWithImages = {
      ...categoryData,
      images: imagePaths,
    };

    return this.categoryService.create(dataWithImages);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Category metadata and image files',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Electronics' },
        description: { type: 'string', example: 'All electronic items' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category updated', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(new FileValidationPipe())
  async update(
    @Param('id') id: number,
    @Body() categoryData: UpdateCategoryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Category> {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }
    // Upload files and get their paths
    const imagePaths = files
      ? await this.fileUploadService.uploadFiles(files, 'local')
      : [];

    // Merge the DTO data with the file paths
    const dataWithImages = {
      ...categoryData,
      images: imagePaths,
    };

    return this.categoryService.update(id, dataWithImages);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({ status: 204, description: 'Category deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: number): Promise<void> {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }
    return this.categoryService.remove(id);
  }
}
