import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const prismaConfig: Prisma.PrismaClientOptions = {
      // log: ['query', 'info', 'warn', 'error'],
      // errorFormat: 'pretty',
    };
    super(prismaConfig);
  }
  async onModuleInit() {
    await this.$connect();
  }
}