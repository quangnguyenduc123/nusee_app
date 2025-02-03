import { Body, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ConfigServerService } from "../services/config-server.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileUploadService } from "src/util/file-upload";
import { Config } from "../entities/config.entity";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "src/util/file-validation.pipe";
import { UpdateConfigDTO } from "../dto/update-config.dto";


@ApiTags('Config')
@Controller('config')
export class ConfigServerController {
    constructor(
      private readonly configService: ConfigServerService,
      private readonly fileUploadService: FileUploadService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get server config' })
    @ApiResponse({
      status: 200,
      description: 'Server config'
    })
    async findAll(): Promise<Config> {
      return this.configService.findAll();
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    @UsePipes(new FileValidationPipe())
    @ApiOperation({ summary: 'Update server config' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Update server config metadata and image files',
      schema: {
        type: 'object',
        properties: {
          data: { type: 'string', example: '{}' },
          images: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
        },
      },
    })
    @ApiResponse({ status: 201 })
    async create(
      @Body() configData: UpdateConfigDTO,
      @UploadedFiles() images: Express.Multer.File[],
    ): Promise<Config> {
      // Upload files and get their paths
      const imagePaths = images
        ? await this.fileUploadService.uploadFiles(images, 'local')
        : [];

      const metaData = JSON.parse(configData.data);
      metaData.data = {
        ...metaData,
        banner: imagePaths,
      }
      const updatedConfig = {
        data: JSON.stringify(metaData.data),
      }
      return this.configService.update(updatedConfig);
    }
  
}