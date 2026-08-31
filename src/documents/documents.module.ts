import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entity/document.entity';
import { MinioModule } from '../minio/minio.module';
@Module({
  controllers: [DocumentsController],
  imports: [TypeOrmModule.forFeature([Document]), MinioModule],
  providers: [DocumentsService],
})
export class DocumentsModule {}
