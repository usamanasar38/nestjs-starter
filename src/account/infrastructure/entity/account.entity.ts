import { BaseEntity } from '@account/infrastructure/entity/base.entity';

export class AccountEntity extends BaseEntity {
  id!: string;
  name = '';
  password = '';
  balance = 0;
}
