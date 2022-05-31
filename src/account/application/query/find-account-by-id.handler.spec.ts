import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectionToken } from '@account/application/injection.token';

import {
  Account,
  AccountQuery,
} from '@account/application/query/account.query';
import { FindAccountByIdHandler } from '@account/application/query/find-account-by-id.handler';
import { FindAccountByIdQuery } from '@account/application/query/find-account-by-id.query';
import { FindAccountByIdResult } from '@account/application/query/find-account-by-id.result';

describe('FindAccountByIdHandler', () => {
  let accountQuery: AccountQuery;
  let handler: FindAccountByIdHandler;

  beforeEach(async () => {
    const queryProvider: Provider = {
      provide: InjectionToken.ACCOUNT_QUERY,
      useValue: {},
    };
    const providers: Provider[] = [queryProvider, FindAccountByIdHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();
    accountQuery = testModule.get(InjectionToken.ACCOUNT_QUERY);
    handler = testModule.get(FindAccountByIdHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when data is not found', async () => {
      accountQuery.findById = jest.fn().mockResolvedValue(undefined);

      const query = new FindAccountByIdQuery(1);

      await expect(handler.execute(query)).rejects.toThrowError(
        NotFoundException,
      );
      expect(accountQuery.findById).toBeCalledTimes(1);
      expect(accountQuery.findById).toBeCalledWith(query.id);
    });

    it('should return FindAccountByIdResult when execute FindAccountByIdQuery', async () => {
      const account: Account = {
        id: 1,
        name: 'test',
        password: 'password',
        balance: 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        openedAt: expect.anything(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updatedAt: expect.anything(),
      };
      accountQuery.findById = jest.fn().mockResolvedValue(account);

      const query = new FindAccountByIdQuery(1);

      const result: FindAccountByIdResult = {
        id: 1,
        name: 'test',
        balance: 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        openedAt: expect.anything(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updatedAt: expect.anything(),
      };

      await expect(handler.execute(query)).resolves.toEqual(result);
      expect(accountQuery.findById).toBeCalledTimes(1);
      expect(accountQuery.findById).toBeCalledWith(query.id);
    });
  });
});
