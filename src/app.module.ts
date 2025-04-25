import { Module } from '@nestjs/common';
import { AuthModule } from './modules';

import { PrismaService } from '../prisma/prisma.serice';

@Module({
  imports: [AuthModule],
  exports: [],
  providers: [PrismaService],
})
export class AppModule {}
