import { IEvent } from '@nestjs/cqrs';

import { AccountProperties } from '@account/domain/account';

export class WithdrawnEvent implements IEvent, AccountProperties {
  readonly id: number;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
}
