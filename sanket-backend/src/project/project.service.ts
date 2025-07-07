// src/projects/projects.service.ts
import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'minio';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService implements OnModuleInit {
  private minioClient: Client;
  private readonly bucketName = 'projects';

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {
    // Initialize MinIO client with Docker service name instead of localhost
    this.minioClient = new Client({
      endPoint: 'minio',  // Use Docker service name
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  async onModuleInit() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
  
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName);
        console.log(`✅ Bucket '${this.bucketName}' created`);
      }
  
      // Set public read policy
      const publicPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
  
      await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(publicPolicy));
      console.log(`🔓 Public read policy applied to '${this.bucketName}'`);
    } catch (error) {
      console.error('❌ MinIO init error:', error);
    }
  }
  

  async create(createProjectDto: CreateProjectDto, codeFile: Express.Multer.File) {
    if (!codeFile) {
      throw new BadRequestException('Code file is required');
    }

    try {
      // Upload file to MinIO
      const fileName = `${Date.now()}-${codeFile.originalname}`;
      await this.minioClient.putObject(
        this.bucketName, 
        fileName, 
        codeFile.buffer
      );

      // Create file URL (this is just the reference, not the download URL)
      const fileUrl = `${this.bucketName}/${fileName}`;

      // Create project
      const project = this.projectsRepository.create({
        ...createProjectDto,
        codeUrl: fileUrl,
      });

      const savedProject = await this.projectsRepository.save(project);
      
      // Generate download URL and return complete project data
      return this.addPublicUrl(savedProject);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new BadRequestException('Failed to create project: ' + error.message);
    }
  }

  async findAll() {
    const projects = await this.projectsRepository.find();
    return Promise.all(projects.map(project => this.addPublicUrl(project)));
  }

  async findOne(id: string) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return this.addPublicUrl(project);
  }

  private addPublicUrl(project: Project) {
    const [bucketName, fileName] = project.codeUrl.split('/');
    const publicUrl = `http://localhost:9000/${bucketName}/${encodeURIComponent(fileName)}`;
    
    return {
      ...project,
      codeUrl: publicUrl,
    };
  }
  
}