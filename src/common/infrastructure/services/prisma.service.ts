import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplicationContext) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
