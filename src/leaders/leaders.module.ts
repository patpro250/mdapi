import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leader } from '../entity/leader.entity';
import { MinioModule } from '../minio/minio.module';
import { LeaderController } from './leaders.controller';
import { LeaderService } from '../leaders/leaders.service';
// ... other imports

@Module({
  imports: [
    TypeOrmModule.forFeature([Leader]),
    // Wrap the circular module in forwardRef
    forwardRef(() => MinioModule),
  ],
  controllers: [LeaderController],
  providers: [LeaderService],
  exports: [LeaderService],
})
export class LeadersModule {}
