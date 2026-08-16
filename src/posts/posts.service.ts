import { Injectable } from '@nestjs/common';
import { Post, PostStatus } from '../entity/posts.entity';
import { CreatePostDto } from '../dto/posts.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly minioService: MinioService, // Inject the MinioService
  ) {} // Replace 'any' with the actual repository type

  async createPost(
    postData: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    if (file) {
      // Upload the file to MinIO and get the object name

      const objectName = await this.minioService.uploadFile(file, 'posts');

      if (!objectName) {
        throw new Error('Failed to upload file to MinIO');
      }
      // Set the featuredImage property to the object name
      postData.featuredImage = objectName;
      postData.status = PostStatus.DRAFT; // Set the status to DRAFT when creating a new post
    }
    console.log("post data before saved", postData)
    return await this.postRepository.save(postData);
  }
}
