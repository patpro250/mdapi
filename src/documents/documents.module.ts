import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entity/document.entity';
@Module({
  controllers: [DocumentsController],
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [DocumentsService],
})
export class DocumentsModule {}
