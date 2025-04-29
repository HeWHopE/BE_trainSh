import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInfo } from 'src/common/decorators/userInfo';
import { UserPayload } from 'src/common/utils/user-payload';
import { JwtGuard } from 'src/modules/auth';

import { CreateTrainDto, TrainDto, UpdateTrainDto } from '../dtos/train.dto';

import { TrainService } from '../services/train.service';

@UseGuards(JwtGuard)
@Controller('train')
export class TrainController {
  private readonly logger = new Logger(TrainController.name);

  constructor(private readonly trainService: TrainService) {}

  @Post()
  async create(@Body() createTrainDto: CreateTrainDto): Promise<TrainDto> {
    try {
      this.logger.log('Creating a new train');
      return await this.trainService.create(createTrainDto);
    } catch (error) {
      this.logger.error('Error creating train', error.stack);
      throw new HttpException(
        'Failed to create train',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<TrainDto[]> {
    try {
      return await this.trainService.findAll();
    } catch (error) {
      this.logger.error('Error fetching trains', error.stack);
      throw new HttpException(
        'Failed to fetch trains',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TrainDto> {
    try {
      const train = await this.trainService.findOne(id);
      if (!train) {
        throw new HttpException('Train not found', HttpStatus.NOT_FOUND);
      }
      return train;
    } catch (error) {
      this.logger.error(`Error fetching train with id ${id}`, error.stack);
      throw new HttpException(
        error.message || 'Failed to fetch train',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  async search(
    @Query('query') query: string,
    @UserInfo() user: UserPayload,
  ): Promise<TrainDto[]> {
    try {
      this.logger.log(`Searching trains with query: ${query}`);
      return await this.trainService.search(query, Number(user.id));
    } catch (error) {
      this.logger.error('Error searching trains', error.stack);
      throw new HttpException(
        'Failed to search trains',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:id')
  async findManyByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TrainDto[]> {
    try {
      this.logger.log(`Fetching trains for user id ${id}`);
      return await this.trainService.findByUserId(id);
    } catch (error) {
      this.logger.error(`Error fetching trains for user id ${id}`, error.stack);
      throw new HttpException(
        'Failed to fetch user trains',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrainDto: UpdateTrainDto,
  ): Promise<TrainDto> {
    try {
      this.logger.log(`Updating train with id ${id}`);
      return await this.trainService.update(id, updateTrainDto);
    } catch (error) {
      this.logger.error(`Error updating train with id ${id}`, error.stack);
      throw new HttpException(
        'Failed to update train',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<TrainDto> {
    try {
      this.logger.log(`Deleting train with id ${id}`);
      return await this.trainService.remove(id);
    } catch (error) {
      this.logger.error(`Error deleting train with id ${id}`, error.stack);
      throw new HttpException(
        'Failed to delete train',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
