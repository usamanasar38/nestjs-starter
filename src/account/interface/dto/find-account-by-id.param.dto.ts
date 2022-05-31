import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FindAccountByIdParamDTO {
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  readonly id: number;
}
