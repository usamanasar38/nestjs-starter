import { ApiProperty } from '@nestjs/swagger';

import {
  FindAccountsResult,
  ItemInFindAccountsResult,
} from '@account/application/query/find-accounts.result';

class FindAccountsItem extends ItemInFindAccountsResult {
  @ApiProperty({ example: 1 })
  readonly id: number;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;
}

export class FindAccountsResponseDTO {
  @ApiProperty({ type: [FindAccountsItem] })
  readonly accounts: FindAccountsResult;
}
