// publish-post.dto.ts

import { IsEnum } from 'class-validator';
import { PostStatus } from '../entity/posts.entity';

export class PublishPostDto {
  @IsEnum(PostStatus)
  status!: PostStatus;
}
