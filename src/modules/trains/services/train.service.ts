import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.serice';
import { CreateTrainDto } from '../dtos/create-train.dto';
import { TrainDto } from '../dtos/train.dto';
import { UpdateTrainDto } from '../dtos/update-train.dto';

@Injectable()
export class TrainService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrainDto: CreateTrainDto): Promise<TrainDto> {
    return await this.prisma.train.create({
      data: createTrainDto,
    });
  }

  async findAll(): Promise<TrainDto[]> {
    return await this.prisma.train.findMany();
  }

  async findOne(id: number): Promise<TrainDto> {
    const train = await this.prisma.train.findUnique({
      where: { id },
    });

    if (!train) throw new NotFoundException('Train not found');

    return train;
  }

  async update(id: number, updateTrainDto: UpdateTrainDto): Promise<TrainDto> {
    return await this.prisma.train.update({
      where: { id },
      data: updateTrainDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.train.delete({
      where: { id },
    });
  }

  async findByUserId(userId: number): Promise<TrainDto[]> {
    const trains = await this.prisma.train.findMany({
      where: { userId }, // Assuming there's a `userId` field in your `train` model
    });

    return trains ? trains : [];
  }

  async search(query: string): Promise<TrainDto[]> {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }

    const trains = await this.prisma.train.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { origin: { contains: query, mode: 'insensitive' } },
          { destination: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return trains;
  }
}
