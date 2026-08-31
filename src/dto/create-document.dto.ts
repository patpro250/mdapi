import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Document file (PDF, DOCX, XLSX, etc.)' })
    file!: Express.Multer.File;

  @ApiProperty({ description: 'Title of the document', maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    title!: string;

  @ApiPropertyOptional({ description: 'Description of the document' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category of the document (e.g., Reports, Policies, Forms)', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    category!: string;
}