import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { PostStatus } from '../entity/posts.entity';
import express from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('featuredImage'))
  async createPost(
    @UploadedFile() featuredImage: Express.Multer.File,

    @Body('title') title: string,

    @Body('content') content: string,

    @Body('category') category?: string,

    @Body('status') status?: PostStatus,
  ) {
    // Generate slug from title
    const slug = title.trim().toLowerCase().replace(/\s+/g, '-');

    const postData = {
      title,
      slug,
      content,
      category,

      status: status ?? PostStatus.DRAFT,
    };

    console.log('POST DATA:', postData);

    return this.postService.createPost(postData, featuredImage);
  }
}
