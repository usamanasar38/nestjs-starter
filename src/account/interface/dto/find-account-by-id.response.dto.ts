import { ApiProperty } from '@nestjs/swagger';

import { FindAccountByIdResult } from '@account/application/query/find-account-by-id.result';

export class FindAccountByIdResponseDTO extends FindAccountByIdResult {
  @ApiProperty({ example: 1 })
  readonly id: number;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;

  @ApiProperty()
  readonly openedAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
