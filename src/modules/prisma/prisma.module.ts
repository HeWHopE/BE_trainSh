// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.serice';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 Make it available to other modules
})
export class PrismaModule {}
