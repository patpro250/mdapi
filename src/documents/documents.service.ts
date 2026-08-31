import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entity/document.entity'; // Adjust path
import { MinioService } from '../minio/minio.service'; // Adjust path
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly minioService: MinioService,
  ) {}

  async upload(file: Express.Multer.File, createDto: CreateDocumentDto) {
    let objectName: string | undefined;

    try {
      // 1. Upload file to MinIO in the 'documents' bucket/folder
      objectName = await this.minioService.uploadFile(file, 'documents');

      // 2. Get presigned URL (or construct public URL if bucket is public)
      const fileUrl = objectName;

      // 3. Save metadata to PostgreSQL
      const document = this.documentRepository.create({
        title: createDto.title,
        description: createDto.description,
        category: createDto.category,
        fileName: file.originalname,
        fileUrl,
        objectName,
        mimeType: file.mimetype,
        fileSize: file.size,
      });

      return await this.documentRepository.save(document);
    } catch (error) {
      console.error('Document upload error:', error);

      // Cleanup: Delete file from MinIO if DB save fails
      if (objectName) {
        await this.minioService.deleteFile(objectName).catch((err) => {
          console.error('Failed to clean up MinIO file after DB error:', err);
        });
      }
      throw new InternalServerErrorException('Failed to upload document');
    }
  }

  async findAll() {
    const documents = await this.documentRepository.find({
      order: { createdAt: 'DESC' },
    });

    // Refresh presigned URLs for all documents
    return Promise.all(
      documents.map(async (doc) => {
        const fileUrl = await this.minioService.getPresignedUrl(doc.objectName);
        return { ...doc, fileUrl };
      }),
    );
  }

  async findOne(id: string) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Refresh presigned URL
    const fileUrl = await this.minioService.getPresignedUrl(
      document.objectName,
    );
    return { ...document, fileUrl };
  }

  async update(
    id: string,
    file: Express.Multer.File | undefined,
    updateDto: UpdateDocumentDto,
  ) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    let newObjectName = document.objectName;
    let newFileUrl = document.fileUrl;

    try {
      // 1. Handle file replacement ONLY if a new file is uploaded
      if (file) {
        // Delete old file from MinIO
        if (document.objectName) {
          await this.minioService
            .deleteFile(document.objectName)
            .catch((err) => {
              console.error('Failed to delete old MinIO document:', err);
            });
        }

        // Upload new file
        newObjectName = await this.minioService.uploadFile(file, 'documents');
        newFileUrl = await this.minioService.getPresignedUrl(newObjectName);
      }

      // 2. Extract 'file' from DTO so TypeORM doesn't try to save it
      const { file: _, ...metadata } = updateDto;

      // 3. Merge text updates safely
      const updatedDoc = this.documentRepository.merge(document, {
        ...metadata,
        objectName: newObjectName,
        fileUrl: newFileUrl,
        // Update file metadata if a new file was uploaded
        ...(file && {
          fileName: file.originalname,
          mimeType: file.mimetype,
          fileSize: file.size,
        }),
      });

      return await this.documentRepository.save(updatedDoc);
    } catch (error) {
      console.error('Document update error:', error);

      // Cleanup: If a new file was uploaded but DB save failed, delete the new file
      if (file && newObjectName !== document.objectName) {
        await this.minioService.deleteFile(newObjectName).catch((err) => {
          console.error(
            'Failed to clean up new MinIO document after DB error:',
            err,
          );
        });
      }

      throw new InternalServerErrorException('Failed to update document');
    }
  }

  async delete(id: string) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    try {
      // Delete from MinIO
      await this.minioService.deleteFile(document.objectName);

      // Delete from DB
      await this.documentRepository.remove(document);

      return { message: 'Document deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete document');
    }
  }
}
