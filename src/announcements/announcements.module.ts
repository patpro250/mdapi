import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '../entity/announcement.entity';

@Module({
  controllers: [AnnouncementsController],
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [AnnouncementsService],
})
export class AnnouncementsModule {}
