import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '../entity/posts.entity';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MinioModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}