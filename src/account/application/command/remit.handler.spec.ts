import {
  ModuleMetadata,
  NotFoundException,
  Provider,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { RemitCommand } from '@account/application/command/remit.command';
import { RemitHandler } from '@account/application/command/remit.handler';
import { InjectionToken } from '@account/application/injection.token';

import { AccountRepository } from '@account/domain/repository';
import { AccountService } from '@account/domain/service';

describe('RemitHandler', () => {
  let handler: RemitHandler;
  let repository: AccountRepository;
  let domainService: AccountService;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const domainServiceProvider: Provider = {
      provide: AccountService,
      useValue: {},
    };
    const providers: Provider[] = [
      RemitHandler,
      repoProvider,
      domainServiceProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(RemitHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
    domainService = testModule.get(AccountService);
  });

  describe('execute', () => {
    it('should throw UnprocessableEntityException when id and receiverId is same', async () => {
      const command = new RemitCommand({
        id: 1,
        receiverId: 2,
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should throw NotFoundException when repository found no account', async () => {
      repository.findByIds = jest.fn().mockResolvedValue([]);

      const command = new RemitCommand({
        id: 1,
        receiverId: 2,
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw NotFoundException when repository found just single account', async () => {
      repository.findByIds = jest.fn().mockResolvedValue([{}]);

      const command = new RemitCommand({
        id: 1,
        receiverId: 2,
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw NotFoundException when account not found', async () => {
      const account = { compareId: (id: number) => id === 2 };
      const receiver = { compareId: (id: number) => id === 3 };

      repository.findByIds = jest.fn().mockResolvedValue([account, receiver]);

      const command = new RemitCommand({
        id: 1,
        receiverId: 3,
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw UnprocessableEntityException receiver is not found', async () => {
      const account = { compareId: (id: number) => id === 1 };
      const receiver = { compareId: (id: number) => id === 2 };

      repository.findByIds = jest.fn().mockResolvedValue([account, receiver]);
      domainService.remit = jest.fn();
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new RemitCommand({
        id: 1,
        receiverId: 3,
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should execute RemitCommand', async () => {
      const account = {
        commit: jest.fn(),
        compareId: (id: number) => id === 1,
      };
      const receiver = {
        commit: jest.fn(),
        compareId: (id: number) => id === 1,
      };

      repository.findByIds = jest.fn().mockResolvedValue([account, receiver]);
      repository.save = jest.fn().mockResolvedValue(undefined);
      const remitMock = jest.fn().mockReturnValue(undefined);
      domainService.remit = remitMock;

      const command = new RemitCommand({
        id: 1,
        receiverId: 2,
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
      expect(remitMock).toBeCalledTimes(1);
      expect(remitMock).toBeCalledWith({
        account,
        receiver,
        password: command.password,
        amount: command.amount,
      });
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith([account, receiver]);
      expect(account.commit).toBeCalledTimes(1);
      expect(receiver.commit).toBeCalledTimes(1);
    });
  });
});
