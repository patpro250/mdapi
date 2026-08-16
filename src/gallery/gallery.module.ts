import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Gallery } from '../entity/gallery.entity';
import { MinioModule } from '../minio/minio.module';

import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery]),
    MinioModule,
  ],

  controllers: [
    GalleryController,
  ],

  providers: [
    GalleryService,
  ],
  exports: [
    GalleryService,
  ],
})
export class GalleryModule {}