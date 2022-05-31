import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from '@account/application/injection.token';
import {
  AccountQuery,
  ItemInAccounts,
} from '@account/application/query/account.query';
import { FindAccountsQuery } from '@account/application/query/find-accounts.query';
import {
  FindAccountsResult,
  ItemInFindAccountsResult,
} from '@account/application/query/find-accounts.result';

@QueryHandler(FindAccountsQuery)
export class FindAccountsHandler
  implements IQueryHandler<FindAccountsQuery, FindAccountsResult>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_QUERY) readonly accountQuery: AccountQuery,
  ) {}

  async execute(query: FindAccountsQuery): Promise<FindAccountsResult> {
    return (await this.accountQuery.find(query.offset, query.limit)).map(
      (account: ItemInAccounts) => this.filterResultProperties(account),
    );
  }

  private filterResultProperties(
    data: ItemInAccounts,
  ): ItemInFindAccountsResult {
    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new ItemInFindAccountsResult());

    if (dataKeys.length < resultKeys.length)
      throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throw new InternalServerErrorException();

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach((dataKey) => delete data[dataKey]);

    return data;
  }
}
