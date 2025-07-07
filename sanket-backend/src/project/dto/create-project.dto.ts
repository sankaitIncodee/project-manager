// src/projects/dto/create-project.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Name of the group leader' })
  @IsNotEmpty()
  @IsString()
  groupLeaderName: string;

  @ApiProperty({ description: 'Project domain or category' })
  @IsNotEmpty()
  @IsString()
  projectDomain: string;

  @ApiProperty({ description: 'Project description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}



export class ProjectResponseDto {
  @ApiProperty({ description: 'Unique project ID' })
  id: string;

  @ApiProperty({ description: 'Project title' })
  title: string;

  @ApiProperty({ description: 'Name of the group leader' })
  groupLeaderName: string;

  @ApiProperty({ description: 'Project domain or category' })
  projectDomain: string;

  @ApiProperty({ description: 'URL to download the project code file' })
  codeUrl: string;

  @ApiProperty({ description: 'Project description' })
  description: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}