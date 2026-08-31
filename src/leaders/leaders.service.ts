import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leader } from '../entity/leader.entity';
import { CreateLeaderDto } from '../dto/create-leader.dto';
import { UpdateLeaderDto } from '../dto/update-leader.dto';
import { MinioService } from '../minio/minio.service'; // Adjust path to your MinioService

@Injectable()
export class LeaderService {
  constructor(
    @InjectRepository(Leader)
    private readonly leaderRepository: Repository<Leader>,
    private readonly minioService: MinioService,
  ) {}

  async create(
    file: Express.Multer.File | undefined,
    createLeaderDto: CreateLeaderDto,
  ) {
    let objectName: string | undefined;

    try {
      // 1. Upload to MinIO ONLY if a file is provided
      if (file) {
        objectName = await this.minioService.uploadFile(file, 'leaders');
      }

      // 2. Save metadata in PostgreSQL (store objectName, not the full URL)
      const leader = this.leaderRepository.create({
        ...createLeaderDto,
        photo: objectName,
      });

      const savedLeader = await this.leaderRepository.save(leader);
      return this.mapLeaderWithPresignedUrl(savedLeader);
    } catch (error) {
      console.error('Error creating leader:', error);
      // Cleanup: If DB save fails, delete the uploaded file to prevent orphans
      if (objectName) {
        await this.minioService.deleteFile(objectName).catch((err) => {
          console.error('Failed to clean up MinIO file after DB error:', err);
        });
      }
      throw new InternalServerErrorException('Failed to create leader');
    }
  }

  async findAll() {
    const leaders = await this.leaderRepository.find({
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC',
      },
    });

    // Generate presigned URLs for each leader's photo
    return Promise.all(
      leaders.map(async (leader) => this.mapLeaderWithPresignedUrl(leader)),
    );
  }

  async findOne(id: string) {
    const leader = await this.leaderRepository.findOne({ where: { id } });

    if (!leader) {
      throw new NotFoundException('Leader not found');
    }

    return this.mapLeaderWithPresignedUrl(leader);
  }

  async update(
    id: string,
    file: Express.Multer.File | undefined,
    updateLeaderDto: UpdateLeaderDto,
  ) {
    const leader = await this.leaderRepository.findOne({ where: { id } });

    if (!leader) {
      throw new NotFoundException('Leader not found');
    }

    let newObjectName = leader.photo;

    try {
      // 1. Handle file update ONLY if a new file is provided
      if (file) {
        // Delete old file from MinIO
        if (leader.photo) {
          await this.minioService.deleteFile(leader.photo).catch((err) => {
            console.error('Failed to delete old MinIO file:', err);
          });
        }
        // Upload new file
        newObjectName = await this.minioService.uploadFile(file, 'leaders');
      }

      // 2. Exclude 'photo' from DTO to prevent TypeORM conflicts (we handle it manually)
      const { photo: _, ...metadata } = updateLeaderDto;

      // 3. Merge updates (TypeORM safely ignores undefined values)
      const updatedLeader = this.leaderRepository.merge(leader, {
        ...metadata,
        photo: newObjectName,
      });

      const savedLeader = await this.leaderRepository.save(updatedLeader);
      return this.mapLeaderWithPresignedUrl(savedLeader);
    } catch (error) {
      console.error('Error updating leader:', error);

      // Cleanup: If a new file was uploaded but DB save failed, delete the new file
      if (file && newObjectName !== leader.photo) {
        await this.minioService.deleteFile(newObjectName).catch((err) => {
          console.error(
            'Failed to clean up new MinIO file after DB error:',
            err,
          );
        });
      }

      throw new InternalServerErrorException('Failed to update leader');
    }
  }

  async remove(id: string) {
    const leader = await this.leaderRepository.findOne({ where: { id } });

    if (!leader) {
      throw new NotFoundException('Leader not found');
    }

    try {
      // Delete from MinIO first
      if (leader.photo) {
        await this.minioService.deleteFile(leader.photo);
      }

      // Then delete from DB
      await this.leaderRepository.remove(leader);

      return { message: 'Leader deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete leader');
    }
  }

  /**
   * Helper method to attach a presigned URL to the leader object for the frontend
   */
  private async mapLeaderWithPresignedUrl(leader: Leader) {
    let photoUrl: string | null = null;

    if (leader.photo) {
      try {
        photoUrl = await this.minioService.getPresignedUrl(leader.photo);
      } catch (error) {
        console.error(
          `Failed to get presigned URL for leader ${leader.id}:`,
          error,
        );
      }
    }

    return {
      ...leader,
      photoUrl, // Expose as photoUrl so frontend knows it's a ready-to-use URL
    };
  }
}
