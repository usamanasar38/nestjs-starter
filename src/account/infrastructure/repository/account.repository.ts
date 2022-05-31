import { Inject } from '@nestjs/common';
import { Account as AccountEntity } from '@prisma/client';
import { AccountRepository } from '@account/domain/repository';
import { Account } from '@account/domain/account';
import { AccountFactory } from '@account/domain/factory';
import { PrismaService } from '@common/infrastructure/services/prisma.service';

export class AccountRepositoryImplement implements AccountRepository {
  constructor(
    @Inject(AccountFactory) private readonly accountFactory: AccountFactory,
    private prismaService: PrismaService,
  ) {}

  async newId(): Promise<number> {
    const emptyEntity = {
      name: '',
      password: '',
      balance: 0,
    };
    const entity = await this.prismaService.account.create({
      data: emptyEntity,
    });
    return entity.id;
  }

  async save(data: Account | Account[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await this.prismaService.account.createMany({
      data: entities,
      skipDuplicates: true,
    });
  }

  async findById(id: number): Promise<Account | null> {
    const entity = await this.prismaService.account.findFirst({
      where: { id },
    });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByIds(ids: number[]): Promise<Account[]> {
    const entities = await this.prismaService.account.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return entities.map((entity) => this.entityToModel(entity));
  }

  async findByName(name: string): Promise<Account[]> {
    const entities = await this.prismaService.account.findMany({
      where: {
        name,
      },
    });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: Account): AccountEntity {
    const properties = model.properties();
    return {
      ...properties,
      createdAt: properties.openedAt,
    };
  }

  private entityToModel(entity: AccountEntity): Account {
    return this.accountFactory.reconstitute({
      ...entity,
      openedAt: entity.createdAt,
    });
  }
}
