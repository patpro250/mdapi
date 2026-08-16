import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gallery } from '../entity/gallery.entity';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,

    private readonly minioService: MinioService,
  ) {}

  async upload(file: Express.Multer.File, title: string, description?: string) {
    // Upload image to MinIO
    const objectName = await this.minioService.uploadFile(file, 'gallery');

    // Save metadata in PostgreSQL
    const gallery = this.galleryRepository.create({
      title,
      description,
      objectName,
      imageUrl: `/mdapi/gallery/file/${objectName}`,

      //   fileSize: file.size,
    });

    return this.galleryRepository.save(gallery);
  }

  async findOne(id: string) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    return gallery;
  }

  async delete(id: string) {
    const gallery = await this.findOne(id);

    await this.minioService.deleteFile(gallery.objectName);

    await this.galleryRepository.remove(gallery);

    return {
      message: 'Gallery image deleted successfully',
    };
  }

  async findAll() {
    const galleries = await this.galleryRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return Promise.all(
      galleries.map(async (gallery) => {
        const imageUrl = await this.minioService.getPresignedUrl(
          gallery.objectName,
        );

        return {
          id: gallery.id,
          title: gallery.title,
          description: gallery.description,
          caption: gallery.caption,
          album: gallery.album,
          isFeatured: gallery.isFeatured,
          objectName: gallery.objectName,
          imageUrl,
          createdAt: gallery.createdAt,
          updatedAt: gallery.updatedAt,
        };
      }),
    );
  }
}
