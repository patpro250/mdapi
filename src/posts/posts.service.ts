import { Injectable, NotFoundException, Param, Patch } from '@nestjs/common';
import { Post, PostStatus } from '../entity/posts.entity';
import { CreatePostDto } from '../dto/posts.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from '../minio/minio.service';
import { PublishPostDto } from '../dto/publish-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly minioService: MinioService, // Inject the MinioService
  ) {} // Replace 'any' with the actual repository type

  async createPost(
    postData: UpdatePostDto,
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
    console.log('post data before saved', postData);
    return await this.postRepository.save(postData);
  }

  async getAllPublisdePost() {
    const allPosts = await this.postRepository.find({
      where: {
        status: PostStatus.PUBLISHED,
      },
    });
    return Promise.all(
      allPosts.map(async (posts) => {
        const img = await this.minioService.getPresignedUrl(
          posts.featuredImage,
        );
        if (!img)
          return new NotFoundException(
            `we cant find post image of post title${posts.title}`,
          );
        return {
          id: posts.id,
          title: posts.title,
          content: posts.content,
          imageurl: img,
          category: posts.category,
          status: posts.status,
          slug: posts.slug,
          author_id: posts.Author_Id,
          created_At: posts.createdAt,
          updated_At: posts.updatedAt,
          published_At: posts.publishedAt,
        };
      }),
    );
  }

  async getAllDraftPPost() {
    const allPosts = await this.postRepository.find({
      where: {
        status: PostStatus.DRAFT,
      },
    });
    return Promise.all(
      allPosts.map(async (posts) => {
        const img = await this.minioService.getPresignedUrl(
          posts.featuredImage,
        );
        if (!img)
          return new NotFoundException(
            `we cant find post image of post title${posts.title}`,
          );
        return {
          id: posts.id,
          title: posts.title,
          content: posts.content,
          imageurl: img,
          category: posts.category,
          status: posts.status,
          slug: posts.slug,
          author_id: posts.Author_Id,
          created_At: posts.createdAt,
          updated_At: posts.updatedAt,
          published_At: posts.publishedAt,
        };
      }),
    );
  }

  async updatePost(
    file: Express.Multer.File,
    createPost: UpdatePostDto,
    id: string,
  ) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }

    // Update text fields
    createPost = {
      title: createPost.title,
      content: createPost.content,
      category: createPost.category,
      status: createPost.status,
      slug: createPost.slug,
    };
    Object.assign(post, createPost);
    console.log('CREATE POST', createPost);
    // Update image only if a new image was uploaded
    if (file) {
      const oldObjectName = post.featuredImage;

      // Delete old image
      if (oldObjectName) {
        const deleted = await this.minioService.deleteFile(oldObjectName);

        if (deleted) {
          console.log(
            `This image [${oldObjectName}] was deleted and will be replaced`,
          );
        }
      }

      // Upload new image
      const objectName = await this.minioService.uploadFile(file, 'posts');

      if (!objectName) {
        throw new Error('Failed to upload image');
      }

      // Set new image
      post.featuredImage = objectName;
    }

    console.log('POST BEFORE SAVE:', post);

    return await this.postRepository.save(post);
  }

  async publishDraftPost(publishPostDto: PublishPostDto, id: string) {
    const exist = await this.postRepository.findOne({
      where: { id },
    });

    if (!exist) {
      throw new NotFoundException('Post does not exist');
    }

    const post = await this.postRepository.preload({
      id,
      status: publishPostDto.status as PostStatus,
    });

    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    return await this.postRepository.save(post);
  }
}
