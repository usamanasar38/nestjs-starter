import { IQueryResult } from '@nestjs/cqrs';

export class FindAccountByIdResult implements IQueryResult {
  readonly id: number = 0;
  readonly name: string = '';
  readonly balance: number = 0;
  readonly openedAt: Date = new Date();
  readonly updatedAt: Date = new Date();
}
