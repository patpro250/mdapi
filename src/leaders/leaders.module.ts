import { Module } from '@nestjs/common';
import { LeadersController } from './leaders.controller';
import { LeadersService } from './leaders.service';
import { Leader } from '../entity/leader.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LeadersController],
  imports: [TypeOrmModule.forFeature([Leader])],
  providers: [LeadersService]
})
export class LeadersModule {}
