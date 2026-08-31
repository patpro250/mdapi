import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from '../entity/gallery.entity';
import { MinioService } from '../minio/minio.service';
import { UpdateGalleryDto } from '../dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    private readonly minioService: MinioService,
  ) {}

  async upload(
    file: Express.Multer.File,
    title: string,
    description?: string,
    caption?: string,
    album?: string,
    isFeatured: boolean = false,
  ) {
    let objectName: string | undefined;

    try {
      // 1. Upload to MinIO
      objectName = await this.minioService.uploadFile(file, 'gallery');

      // 2. Save metadata in PostgreSQL
      const gallery = this.galleryRepository.create({
        title,
        description,
        caption,
        album,
        isFeatured,
        objectName,
        imageUrl: objectName,
      });

      return await this.galleryRepository.save(gallery);
    } catch (error) {
      console.log(error);
      if (objectName) {
        await this.minioService.deleteFile(objectName).catch((err) => {
          console.error('Failed to clean up MinIO file after DB error:', err);
        });
      }
      throw new InternalServerErrorException('Failed to upload gallery image');
    }
  }

  async update(
    id: string,
    file: Express.Multer.File | undefined,
    updateGalleryDto: UpdateGalleryDto,
  ) {
    const gallery = await this.galleryRepository.findOne({ where: { id } });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    let newObjectName = gallery.objectName;

    try {
      // 1. Handle file update ONLY if a new file is provided
      if (file) {
        // Delete old file from MinIO
        if (gallery.objectName) {
          await this.minioService.deleteFile(gallery.objectName).catch((err) => {
            console.error('Failed to delete old MinIO file:', err);
          });
        }
        // Upload new file
        newObjectName = await this.minioService.uploadFile(file, 'gallery');
      }

      // 2. Extract 'file' from DTO so it doesn't get passed to TypeORM
      const { file: _, ...metadata } = updateGalleryDto;

      // 3. Merge updates (TypeORM safely ignores undefined values)
      const updatedGallery = this.galleryRepository.merge(gallery, {
        ...metadata,
        objectName: newObjectName,
        imageUrl: newObjectName, 
      });

      return await this.galleryRepository.save(updatedGallery);
    } catch (error) {
      console.error('Error updating gallery:', error);
      
      // Cleanup: If a new file was uploaded but DB save failed, delete the new file to prevent orphans
      if (file && newObjectName !== gallery.objectName) {
        await this.minioService.deleteFile(newObjectName).catch((err) => {
          console.error('Failed to clean up new MinIO file after DB error:', err);
        });
      }
      
      throw new InternalServerErrorException('Failed to update gallery image');
    }
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

    try {
      // Delete from MinIO first
      await this.minioService.deleteFile(gallery.objectName);

      // Then delete from DB
      await this.galleryRepository.remove(gallery);

      return { message: 'Gallery image deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete gallery image');
    }
  }

  async findAll() {
    const galleries = await this.galleryRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    // ⚠️ WARNING: If `galleries` is large, this will cause an N+1 performance issue.
    // Consider making the bucket public and constructing the URL directly,
    // or returning `objectName` and letting the frontend request presigned URLs as needed.
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
