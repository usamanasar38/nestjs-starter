import { IQueryResult } from '@nestjs/cqrs';

export class ItemInFindAccountsResult {
  readonly id: number = 0;
  readonly name: string = '';
  readonly balance: number = 0;
}

export class FindAccountsResult
  extends Array<ItemInFindAccountsResult>
  implements IQueryResult {}
