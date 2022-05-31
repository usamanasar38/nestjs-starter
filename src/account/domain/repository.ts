import { Account } from '@account/domain/account';

export interface AccountRepository {
  newId: () => Promise<number>;
  save: (account: Account | Account[]) => Promise<void>;
  findById: (id: number) => Promise<Account | null>;
  findByIds: (ids: number[]) => Promise<Account[]>;
  findByName: (name: string) => Promise<Account[]>;
}
