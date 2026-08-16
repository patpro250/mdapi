import { Module } from '@nestjs/common';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../entity/program.entity';

@Module({
  controllers: [ProgramsController],
  imports: [TypeOrmModule.forFeature([Program])],
  providers: [ProgramsService],
})
export class ProgramsModule {}
