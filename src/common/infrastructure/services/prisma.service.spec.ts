class PrismaClient {
  $connect = jest.fn();
  $on(event, cb) {
    cb(event);
  }
}
jest.mock('@prisma/client', () => {
  return { PrismaClient };
});
import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/services/prisma.service';

describe('PrismaService', () => {
  const prismaService = new PrismaService();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('onModuleInit should call connect', async () => {
    await prismaService.onModuleInit();
  });

  it('enableShutdownHooks should call connect', () => {
    const app = {
      close() {
        return;
      },
    } as INestApplicationContext;
    prismaService.enableShutdownHooks(app);
  });
});
