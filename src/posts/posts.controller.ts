import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe, // Use ParseIntPipe if your IDs are numbers
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { PostStatus } from '../entity/posts.entity';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/posts.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PublishPostDto } from '../dto/publish-post.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Posts') // Groups all endpoints under "Posts" in Swagger UI
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Create a new post with a featured image' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g., missing file or invalid data)',
  })
  @ApiConsumes('multipart/form-data') // Critical for file uploads
  @ApiBody({ type: CreatePostDto }) // Tells Swagger to render the form fields
  @UseInterceptors(FileInterceptor('featuredImage'))
  async createPost(
    @UploadedFile() featuredImage: Express.Multer.File,
    @Body() createPostDto: UpdatePostDto,
  ) {
    // Generate slug from title
    const slug = createPostDto?.title?.trim().toLowerCase().replace(/\s+/g, '-') || undefined;

    const postData: UpdatePostDto = {
      ...createPostDto,
      slug,
      status: createPostDto.status ?? PostStatus.DRAFT,
    };

    console.log('POST DATA:', postData);

    return this.postService.createPost(postData, featuredImage);
  }

  @Public()
  @Get('/pub')
  @ApiOperation({ summary: 'Get all published posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of published posts',
  })
  async findPublished() {
    return await this.postService.getAllPublisdePost();
  }

  @Get('/dra')
  @ApiOperation({ summary: 'Get all draft posts' })
  @ApiResponse({ status: 200, description: 'Returns an array of draft posts' })
  async findDraft() {
    return await this.postService.getAllDraftPPost();
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update an existing post (optionally update image)',
  })
  @ApiParam({ name: 'id', description: 'Post ID', type: 'string' }) // Use type: 'integer' if ID is a number
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePostDto })
  @UseInterceptors(FileInterceptor('postimage'))
  async updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() postImage: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const slug = updatePostDto.title
      ? updatePostDto.title.trim().toLowerCase().replace(/\s+/g, '-')
      : undefined;

    const postData = {
      ...updatePostDto,
      ...(slug && { slug }),
    };

    console.log('Debug in controller', postData);

    return await this.postService.updatePost(postImage, postData, id);
  }

  @Public()
  @Post('/status/:id')
  @ApiOperation({ summary: 'Publish a draft post' })
  @ApiParam({ name: 'id', description: 'Post ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBody({ type: PublishPostDto })
  async publishDraft(
    @Body() dto: PublishPostDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.postService.publishDraftPost(dto, id);
  }
}
