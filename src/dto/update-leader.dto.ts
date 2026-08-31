import { PartialType } from '@nestjs/swagger';
import { CreateLeaderDto } from './create-leader.dto';

// PartialType makes all fields from CreateLeaderDto optional
export class UpdateLeaderDto extends PartialType(CreateLeaderDto) {}
