// src/dto/update-post.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './posts.dto';

// This automatically makes all fields in CreatePostDto optional for updates
export class UpdatePostDto extends PartialType(CreatePostDto) {}
