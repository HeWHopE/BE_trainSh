import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// DTO for creating a new train
export class CreateTrainDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @Type(() => Date) // Ensures the value is properly transformed into a Date object
  @IsNotEmpty()
  departure: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  arrival: Date;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

// DTO for returning train information
export class TrainDto {
  id: number;
  name: string;
  departure: Date;
  arrival: Date;
  origin: string;
  destination: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTO for updating train details
import { PartialType } from '@nestjs/mapped-types';
export class UpdateTrainDto extends PartialType(CreateTrainDto) {}
