// src/projects/entities/project.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('projects')
export class Project {
  @ApiProperty({ description: 'Unique project ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Project title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Name of the group leader' })
  @Column({ name: 'group_leader_name' })
  groupLeaderName: string;

  @ApiProperty({ description: 'Project domain or category' })
  @Column({ name: 'project_domain' })
  projectDomain: string;

  @ApiProperty({ description: 'Storage reference for code file' })
  @Column({ name: 'code_url' })
  codeUrl: string;

  @ApiProperty({ description: 'Project description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}