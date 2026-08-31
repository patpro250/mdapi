import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ description: 'Title of the gallery image' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Description of the image' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Caption for the image' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ description: 'Album name or category' })
  @IsOptional()
  @IsString()
  album?: string;

  @ApiPropertyOptional({
    default: false,
    description: 'Whether the image is featured',
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;
}
