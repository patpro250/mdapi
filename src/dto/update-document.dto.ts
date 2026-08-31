import { PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';

// Makes all fields optional for PATCH requests
export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}
