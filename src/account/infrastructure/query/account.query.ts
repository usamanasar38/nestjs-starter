import { Injectable } from '@nestjs/common';
import { Account as AccountEntity } from '@prisma/client';
import {
  Account,
  AccountQuery,
  Accounts,
} from '@account/application/query/account.query';
import { PrismaService } from '@common/infrastructure/services/prisma.service';

@Injectable()
export class AccountQueryImplement implements AccountQuery {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number): Promise<undefined | Account> {
    return this.convertAccountFromEntity(
      await this.prismaService.account.findFirst({
        where: {
          id,
        },
      }),
    );
  }

  async find(offset: number, limit: number): Promise<Accounts> {
    return this.convertAccountsFromEntities(
      await this.prismaService.account.findMany({ skip: offset, take: limit }),
    );
  }

  private convertAccountFromEntity(
    entity: AccountEntity | null,
  ): undefined | Account {
    return entity ? { ...entity, openedAt: entity.createdAt } : undefined;
  }

  private convertAccountsFromEntities(entities: AccountEntity[]): Accounts {
    return entities.map((entity) => ({
      ...entity,
      openedAt: entity.createdAt,
    }));
  }
}
