import {
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AccountImplement } from '@account/domain/account';
import { AccountClosedEvent } from '@account/domain/event/account-closed.event';
import { AccountOpenedEvent } from '@account/domain/event/account-opened.event';
import { DepositedEvent } from '@account/domain/event/deposited.event';
import { PasswordUpdatedEvent } from '@account/domain/event/password-updated.event';
import { WithdrawnEvent } from '@account/domain/event/withdrawn.event';

describe('Account', () => {
  describe('properties', () => {
    it('should return AccountProperties', () => {
      const properties = {
        id: 1,
        name: 'name',
        password: '',
        balance: 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        openedAt: expect.anything(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updatedAt: expect.anything(),
      };

      const account = new AccountImplement({ id: 1, name: 'name' });

      const result = account.properties();

      expect(result).toEqual(properties);
    });
  });

  describe('open', () => {
    it('should apply AccountOpenedEvent', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });

      account.open('password');

      const result = account.getUncommittedEvents();

      expect(result).toEqual([
        Object.assign(new AccountOpenedEvent(), account),
      ]);
    });
  });

  describe('updatePassword', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });
      account.open('password');
      account.uncommit();

      expect(() =>
        account.updatePassword('wrongPassword', 'newPassword'),
      ).toThrowError(UnauthorizedException);
    });

    it('should update password', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });
      account.open('password');
      account.uncommit();

      account.updatePassword('password', 'newPassword');

      account.getUncommittedEvents();

      expect(account.properties().password).not.toEqual('');
      expect(account.properties().password).not.toEqual('password');
      expect(() => account.open('data')).toThrowError(
        InternalServerErrorException,
      );
      expect(account.getUncommittedEvents().length).toEqual(1);
      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new PasswordUpdatedEvent(), account),
      ]);
      expect(account.updatePassword('newPassword', 'data')).toEqual(undefined);
    });
  });

  describe('withdraw', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });
      account.open('password');
      account.uncommit();

      expect(() => account.withdraw(0, 'wrongPassword')).toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });
      account.open('password');
      account.uncommit();

      expect(() => account.withdraw(0, 'password')).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should throw UnprocessableEntityException when given amount is over account balance', () => {
      const account = new AccountImplement({
        id: 1,
        name: 'name',
        balance: 0,
      });
      account.open('password');
      account.uncommit();

      expect(() => account.withdraw(1, 'password')).toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should withdraw from account', () => {
      const account = new AccountImplement({
        id: 1,
        name: 'name',
        balance: 1,
      });
      account.open('password');
      account.uncommit();

      expect(account.withdraw(1, 'password')).toEqual(undefined);

      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new WithdrawnEvent(), account),
      ]);
    });
  });

  describe('deposit', () => {
    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });
      account.open('password');
      account.uncommit();

      expect(() => account.deposit(0)).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should deposit to account', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });
      account.open('password');
      account.uncommit();

      account.deposit(1);

      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new DepositedEvent(), account),
      ]);
      expect(account.withdraw(1, 'password')).toEqual(undefined);
    });
  });

  describe('close', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });
      account.open('password');
      account.uncommit();

      expect(() => account.close('wrongPassword')).toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnprocessableEntityException when account balance is over 0', () => {
      const account = new AccountImplement({
        id: 1,
        name: 'name',
        balance: 1,
      });
      account.open('password');
      account.uncommit();

      expect(() => account.close('password')).toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should close account', () => {
      const account = new AccountImplement({ id: 1, name: 'name' });

      account.open('password');
      account.uncommit();

      account.close('password');
      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new AccountClosedEvent(), account),
      ]);
    });
  });
});
