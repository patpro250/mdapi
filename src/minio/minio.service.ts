import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),

      port: Number(this.configService.get<string>('MINIO_PORT', '9000')),

      useSSL:
        this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',

      accessKey: this.configService.get<string>(
        'MINIO_ACCESS_KEY',
        'minioadmin',
      ),

      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', '123pacy#'),
    });

    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'materdei');
  }

  async onModuleInit() {
    await this.createBucket();
  }

  private async createBucket() {
    try {
      const exists = await this.client.bucketExists(this.bucket);

      if (!exists) {
        await this.client.makeBucket(this.bucket);

        console.log(`MinIO bucket "${this.bucket}" created`);
      } else {
        console.log(`MinIO bucket "${this.bucket}" already exists`);
      }
    } catch (error) {
      console.error('MinIO connection error:', error);
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const objectName = `${folder}/${Date.now()}-${file.originalname}`;

      await this.client.putObject(
        this.bucket,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return objectName;
    } catch (error) {
      console.error('MinIO upload error:', error);

      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async getFile(objectName: string) {
    return this.client.getObject(this.bucket, objectName);
  }

  async deleteFile(objectName: string) {
    await this.client.removeObject(this.bucket, objectName);
  }

  async getPresignedUrl(objectName: string): Promise<string> {
    return this.client.presignedGetObject(
      this.bucket,
      objectName,
      60 * 60, // 1 hour
    );
  }
}
