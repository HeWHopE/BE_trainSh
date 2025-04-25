import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateTrainDto } from '../dtos/create-train.dto';
import { UpdateTrainDto } from '../dtos/update-train.dto';

import { UserInfo } from 'src/common/decorators/userInfo';
import { UserPayload } from 'src/common/utils/user-payload';
import { TrainDto } from '../dtos/train.dto';
import { TrainService } from '../services/train.service';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Post()
  async create(
    @Body() createTrainDto: CreateTrainDto,
    @UserInfo() user: UserPayload,
  ): Promise<TrainDto> {
    return this.trainService.create(createTrainDto);
  }

  @Get()
  async findAll(): Promise<TrainDto[]> {
    return this.trainService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TrainDto> {
    return this.trainService.findOne(id);
  }

  @Get('search/search')
  async search(@Query('query') query: string): Promise<TrainDto[]> {
    return this.trainService.search(query);
  }

  @Get('user/:id')
  async findManyByUserId(@Param('id') id: string): Promise<TrainDto[]> {
    return this.trainService.findByUserId(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTrainDto: UpdateTrainDto,
  ): Promise<TrainDto> {
    return this.trainService.update(Number(id), updateTrainDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<TrainDto> {
    return this.trainService.remove(id);
  }
}
