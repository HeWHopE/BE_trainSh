import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.serice';

import { CreateTrainDto, TrainDto, UpdateTrainDto } from '../dtos/train.dto';

@Injectable()
export class TrainService {
  private readonly logger = new Logger(TrainService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createTrainDto: CreateTrainDto): Promise<TrainDto> {
    try {
      this.logger.log('Creating a new train record');
      return await this.prisma.train.create({
        data: createTrainDto,
      });
    } catch (error) {
      this.logger.error('Error creating train', error.stack);
      throw new BadRequestException('Failed to create train');
    }
  }

  async findAll(): Promise<TrainDto[]> {
    try {
      return await this.prisma.train.findMany({});
    } catch (error) {
      this.logger.error('Error fetching trains', error.stack);
      throw new BadRequestException('Failed to fetch trains');
    }
  }

  async findOne(id: number): Promise<TrainDto> {
    try {
      this.logger.log(`Fetching train with id: ${id}`);
      const train = await this.prisma.train.findUnique({
        where: { id },
      });

      if (!train) {
        this.logger.warn(`Train with id ${id} not found`);
        throw new NotFoundException('Train not found');
      }

      return train;
    } catch (error) {
      this.logger.error(`Error fetching train with id ${id}`, error.stack);
      throw error;
    }
  }
  async update(
    id: number,
    updateTrainDto: UpdateTrainDto,
    userId: number, // Assuming the user's ID is passed in from authentication
  ): Promise<TrainDto> {
    try {
      this.logger.log(`Updating train with id: ${id}`);

      // Fetch the train to check if the current user is the owner
      const train = await this.prisma.train.findUnique({
        where: { id },
        select: { userId: true }, // Assuming the train record has a 'userId' field
      });

      if (!train) {
        throw new NotFoundException('Train not found');
      }

      // Check if the current user is the owner
      if (train.userId !== userId) {
        throw new UnauthorizedException('You are not the owner of this train');
      }

      // Proceed with the update if the user is the owner
      return await this.prisma.train.update({
        where: { id },
        data: updateTrainDto,
      });
    } catch (error) {
      this.logger.error(`Error updating train with id ${id}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error; // Rethrow known exceptions
      }
      throw new BadRequestException('Failed to update train');
    }
  }

  async remove(id: number): Promise<TrainDto> {
    try {
      this.logger.log(`Deleting train with id: ${id}`);
      return await this.prisma.train.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting train with id ${id}`, error.stack);
      if (error.code === 'P2025') {
        throw new NotFoundException('Train not found');
      }
      throw new BadRequestException('Failed to delete train');
    }
  }

  async findByUserId(userId: number): Promise<TrainDto[]> {
    try {
      this.logger.log(`Fetching trains for user id: ${userId}`);
      return await this.prisma.train.findMany({
        where: { userId },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching trains for user id ${userId}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch trains for user');
    }
  }

  async search(
    query: string,
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<TrainDto[]> {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }

    try {
      this.logger.log(
        `Searching trains with query: ${query} for user: ${userId}`,
      );
      const offset = (page - 1) * limit;

      return await this.prisma.train.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { origin: { contains: query, mode: 'insensitive' } },
                { destination: { contains: query, mode: 'insensitive' } },
              ],
            },
            { userId: userId },
          ],
        },
        skip: offset,
        take: limit,
      });
    } catch (error) {
      this.logger.error('Error searching trains', error.stack);
      throw new BadRequestException('Failed to search trains');
    }
  }
}
