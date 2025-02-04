import { Controller, Get, Body, Param, Put, Delete, UseGuards, UseInterceptors, UsePipes, Post, UploadedFiles, Request } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/util/file-validation.pipe';
import { FileUploadService } from 'src/util/file-upload';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService, private readonly fileUploadService: FileUploadService,) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FilesInterceptor('images'))
    @UsePipes(new FileValidationPipe({ isOptional: true }))
    @ApiOperation({ summary: 'Create a new post' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Post metadata and image files',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'string', example: '<h1>abc</h1>' },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Post created', type: PostEntity })
    async create(@Body() createPostDto: CreatePostDto, @Request() req, @UploadedFiles() images?: Express.Multer.File[]): Promise<PostEntity> {

        const userId = req.user.userId;
        const imagePaths = images
            ? await this.fileUploadService.uploadFiles(images, 'local')
            : [];

        // Merge the DTO data with the file paths
        const dataWithImages = {
            ...createPostDto,
            images: imagePaths,
            user_id: userId,
        };

        return this.postService.create(dataWithImages);
    }

    @Get()
    @ApiOperation({ summary: 'Get all posts' })
    @ApiResponse({
        status: 200,
        description: 'List of posts',
        type: [PostEntity],
    })
    async findAll(): Promise<PostEntity[]> {
        return this.postService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a post by ID' })
    @ApiParam({ name: 'id', description: 'Post ID', type: Number })
    @ApiResponse({ status: 200, description: 'Post details', type: PostEntity })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        return this.postService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FilesInterceptor('images'))
    @UsePipes(new FileValidationPipe())
    @ApiOperation({ summary: 'Create a new post' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Post metadata and image files',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'string', example: '<h1>abc</h1>' },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @UploadedFiles() images?: Express.Multer.File[]): Promise<PostEntity> {
        const imagePaths = images
            ? await this.fileUploadService.uploadFiles(images, 'local')
            : [];

        // Merge the DTO data with the file paths
        const dataWithImages = {
            ...updatePostDto,
            images: imagePaths,
        };

        return this.postService.update(id, dataWithImages);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.postService.remove(id);
    }
}