import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Agency, AgencyRelationship } from '../entities';
import { AgencyService } from '../services';
import { PinoLoggerService } from 'src/logger/pino-logger.service';

@ApiTags('Agencies')
@Controller('agencies')
export class AgencyController {
  constructor(
    private readonly agencyService: AgencyService,
    private readonly logger: PinoLoggerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an agency' })
  @ApiBody({
    description: 'Create Agency DTO',
    type: Agency,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          name: 'Agency 1',
          parent: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The agency has been successfully created.',
    type: Agency,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          name: 'Agency 1',
          parent: null,
        },
      },
    },
  })
  create(@Body() agency: Agency): Promise<Agency> {
    return this.agencyService.create(agency);
  }

  @Get()
  @ApiOperation({ summary: 'List all agencies' })
  @ApiResponse({
    status: 200,
    description: 'List of agencies',
    type: [Agency],
    examples: {
      example1: {
        summary: 'Example response',
        value: [
          {
            id: 1,
            name: 'Agency 1',
            parent: null,
          },
          {
            id: 2,
            name: 'Agency 2',
            parent: {
              id: 1,
              name: 'Agency 1',
            },
          },
        ],
      },
    },
  })
  findAll(): Promise<Agency[]> {
    return this.agencyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agency by ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The agency details',
    type: Agency,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          name: 'Agency 1',
          parent: null,
        },
      },
    },
  })
  findOne(@Param('id') id: number): Promise<Agency> {
    return this.agencyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an agency by ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({
    description: 'Update Agency DTO',
    type: Agency,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          name: 'Updated Agency 1',
          parent: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The agency has been successfully updated.',
    type: Agency,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          name: 'Updated Agency 1',
          parent: null,
        },
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body() agency: Partial<Agency>,
  ): Promise<void> {
    return this.agencyService.update(id, agency);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agency by ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The agency has been successfully deleted.',
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          message: 'Agency with ID 1 has been successfully deleted.',
        },
      },
    },
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.agencyService.remove(id);
  }

  @Post(':parentId/relationship/:childId')
  @ApiOperation({
    summary: 'Create a relationship between parent and child agency',
  })
  @ApiParam({ name: 'parentId', required: true, example: 1 })
  @ApiParam({ name: 'childId', required: true, example: 2 })
  @ApiResponse({
    status: 201,
    description: 'The relationship has been successfully created.',
    type: AgencyRelationship,
    examples: {
      example1: {
        summary: 'Example response',
        value: {
          id: 1,
          parent: {
            id: 1,
            name: 'Agency 1',
          },
          child: {
            id: 2,
            name: 'Agency 2',
          },
        },
      },
    },
  })
  async createRelationship(
    @Param('parentId') parentId: number,
    @Param('childId') childId: number,
  ): Promise<AgencyRelationship> {
    return this.agencyService.createRelationship(parentId, childId);
  }

  @Get(':parentId/children')
  @ApiOperation({ summary: 'Get all children of a parent agency' })
  @ApiParam({ name: 'parentId', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of child agencies',
    type: [Agency],
    examples: {
      example1: {
        summary: 'Example response',
        value: [
          {
            id: 2,
            name: 'Agency 2',
            parent: {
              id: 1,
              name: 'Agency 1',
            },
          },
          {
            id: 3,
            name: 'Agency 3',
            parent: {
              id: 1,
              name: 'Agency 1',
            },
          },
        ],
      },
    },
  })
  async getChildren(@Param('parentId') parentId: number): Promise<Agency[]> {
    this.logger.log(`Fetching children for parentId: ${parentId}`);
    return this.agencyService.getChildren(parentId);
  }

  @Get(':childId/parents')
  @ApiOperation({ summary: 'Get all parents of a child agency' })
  @ApiParam({ name: 'childId', required: true, example: 2 })
  @ApiResponse({
    status: 200,
    description: 'List of parent agencies',
    type: [Agency],
    examples: {
      example1: {
        summary: 'Example response',
        value: [
          {
            id: 1,
            name: 'Agency 1',
            parent: null,
          },
          {
            id: 2,
            name: 'Agency 2',
            parent: {
              id: 1,
              name: 'Agency 1',
            },
          },
        ],
      },
    },
  })
  async getParents(@Param('childId') childId: number): Promise<Agency[]> {
    return this.agencyService.getParents(childId);
  }
}
