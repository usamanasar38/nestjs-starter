export class Account {
  readonly id: number;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
}

export class ItemInAccounts {
  readonly id: number;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
}

export class Accounts extends Array<ItemInAccounts> {}

export interface AccountQuery {
  findById: (id: number) => Promise<Account | undefined>;
  find: (offset: number, limit: number) => Promise<Accounts>;
}
