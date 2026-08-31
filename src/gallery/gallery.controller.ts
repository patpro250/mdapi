import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseUUIDPipe,
  Patch, // Use ParseIntPipe if your ID is a number
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from '../dto/create-gallery.dto';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateGalleryDto } from '../dto/update-gallery.dto';

@ApiTags('Gallery') // Groups endpoints in Swagger UI
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('/upload')
  @ApiOperation({ summary: 'Upload a new image to the gallery' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Gallery image upload',
    type: CreateGalleryDto, // Swagger needs this to document multipart fields
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGalleryDto: CreateGalleryDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Optional: Add file type/size validation here if not handled by Multer options
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPG, PNG, WEBP, and GIF files are allowed',
      );
    }

    return this.galleryService.upload(
      file,
      createGalleryDto.title,
      createGalleryDto.description,
      createGalleryDto.caption,
      createGalleryDto.album,
      createGalleryDto.isFeatured,
    );
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all gallery images' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of gallery images',
  })
  async findAll() {
    return this.galleryService.findAll();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing gallery image (metadata and/or file)',
  })
  @ApiParam({ name: 'id', description: 'Gallery item ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Gallery image updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery image not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateGalleryDto })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateGalleryDto: UpdateGalleryDto,
  ) {
    return this.galleryService.update(id, file, updateGalleryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific gallery image by ID' })
  @ApiResponse({ status: 200, description: 'Returns the gallery image' })
  @ApiResponse({ status: 404, description: 'Gallery image not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Note: If your IDs are numbers, change ParseUUIDPipe to ParseIntPipe
    return this.galleryService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Gallery image deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery image not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.galleryService.delete(id);
  }
}
