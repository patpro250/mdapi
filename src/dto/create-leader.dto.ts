import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsBoolean,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaderDto {
  @IsString()
  @MaxLength(250)
  name!: string;

  @IsString()
  @MaxLength(150)
  position!: string;

  photo!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @Type(() => Number) // Converts string from FormData to number
  @IsInt()
  displayOrder?: number;

  @IsOptional()
  @Type(() => Boolean) // Converts string from FormData to boolean
  @IsBoolean()
  isActive?: boolean;
}
