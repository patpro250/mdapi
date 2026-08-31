import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { CreateLeaderDto } from '../dto/create-leader.dto';
import { UpdateLeaderDto } from '../dto/update-leader.dto';
import { LeaderService } from '../leaders/leaders.service';

@ApiTags('Leaders')
@Controller('leaders')
export class LeaderController {
  constructor(private readonly leaderService: LeaderService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) // 5MB max
        .addFileTypeValidator({ fileType: /image\/(jpeg|jpg|png|gif|webp)/ })
        .build({ fileIsRequired: false }), // Photo is optional
    )
    file: Express.Multer.File | undefined,
    @Body() createLeaderDto: CreateLeaderDto,
  ) {
    return this.leaderService.create(file, createLeaderDto);
  }

  @Get()
  async findAll() {
    return this.leaderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leaderService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .addFileTypeValidator({ fileType: /image\/(jpeg|jpg|png|gif|webp)/ })
        .build({ fileIsRequired: false }),
    )
    file: Express.Multer.File | undefined,
    @Body() updateLeaderDto: UpdateLeaderDto,
  ) {
    return this.leaderService.update(id, file, updateLeaderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.leaderService.remove(id);
  }
}
