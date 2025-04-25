import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.serice';
import { TrainController } from './controllers/train.controller';
import { TrainService } from './services/train.service';

@Module({
  controllers: [TrainController],
  providers: [TrainService, PrismaService],
})
export class TrainModule {}
