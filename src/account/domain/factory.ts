import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  Account,
  AccountImplement,
  AccountProperties,
} from '@account/domain/account';

export class AccountFactory {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
  ) {}

  create(id: number, name: string): Account {
    return this.eventPublisher.mergeObjectContext(
      new AccountImplement({ id, name }),
    );
  }

  reconstitute(properties: AccountProperties): Account {
    return this.eventPublisher.mergeObjectContext(
      new AccountImplement(properties),
    );
  }
}
