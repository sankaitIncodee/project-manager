// src/projects/projects.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiConsumes, 
  ApiProduces,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProjectsService } from './project.service';
import { CreateProjectDto, ProjectResponseDto } from './dto/create-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a project' })
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        groupLeaderName: { type: 'string' },
        projectDomain: { type: 'string' },
        description: { type: 'string' },
        codeFile: {
          type: 'string',
          format: 'binary',
          description: 'Project code as a zip file',
        },
      },
      required: ['title', 'groupLeaderName', 'projectDomain', 'description', 'codeFile'],
    },
  })
  @ApiCreatedResponse({
    description: 'The project has been successfully created',
    type: ProjectResponseDto,
  })
  @UseInterceptors(FileInterceptor('codeFile'))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() codeFile: Express.Multer.File,
  ): Promise<ProjectResponseDto> {
    if (!codeFile) {
      throw new Error('Code file is required');
    }
    return this.projectsService.create(createProjectDto, codeFile);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiOkResponse({
    description: 'List of all projects',
    type: [ProjectResponseDto],
  })
  async findAll(): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID (UUID)' })
  @ApiOkResponse({
    description: 'The found project',
    type: ProjectResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id);
  }
}