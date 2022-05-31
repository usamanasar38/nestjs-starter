import {
  UnprocessableEntityException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { ErrorMessage } from '@account/domain/error';
import { AccountClosedEvent } from '@account/domain/event/account-closed.event';
import { AccountOpenedEvent } from '@account/domain/event/account-opened.event';
import { DepositedEvent } from '@account/domain/event/deposited.event';
import { PasswordUpdatedEvent } from '@account/domain/event/password-updated.event';
import { WithdrawnEvent } from '@account/domain/event/withdrawn.event';

export type AccountEssentialProperties = Required<{
  readonly id: number;
  readonly name: string;
}>;

export type AccountOptionalProperties = Partial<{
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
}>;

export type AccountProperties = AccountEssentialProperties &
  Required<AccountOptionalProperties>;

export interface Account {
  properties: () => AccountProperties;
  compareId: (id: number) => boolean;
  open: (password: string) => void;
  updatePassword: (password: string, data: string) => void;
  withdraw: (amount: number, password: string) => void;
  deposit: (amount: number) => void;
  close: (password: string) => void;
  commit: () => void;
}

export class AccountImplement extends AggregateRoot implements Account {
  private readonly id: number;
  private readonly name: string;
  private password = '';
  private balance = 0;
  private readonly openedAt: Date = new Date();
  private updatedAt: Date = new Date();

  constructor(
    properties: AccountEssentialProperties & AccountOptionalProperties,
  ) {
    super();
    Object.assign(this, properties);
  }

  properties(): AccountProperties {
    return {
      id: this.id,
      name: this.name,
      password: this.password,
      balance: this.balance,
      openedAt: this.openedAt,
      updatedAt: this.updatedAt,
    };
  }

  compareId(id: number): boolean {
    return id === this.id;
  }

  open(password: string): void {
    this.setPassword(password);
    this.apply(Object.assign(new AccountOpenedEvent(), this));
  }

  private setPassword(password: string): void {
    if (this.password !== '' || password === '')
      throw new InternalServerErrorException(ErrorMessage.CAN_NOT_SET_PASSWORD);
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(password, salt);
    this.updatedAt = new Date();
  }

  updatePassword(password: string, data: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();

    this.updatedAt = new Date();
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(data, salt);
    this.apply(Object.assign(new PasswordUpdatedEvent(), this));
  }

  withdraw(amount: number, password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_WITHDRAW_UNDER_1,
      );
    if (this.balance < amount)
      throw new UnprocessableEntityException(
        ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
      );
    this.balance -= amount;
    this.updatedAt = new Date();
    this.apply(Object.assign(new WithdrawnEvent(), this));
  }

  deposit(amount: number): void {
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_DEPOSIT_UNDER_1,
      );
    this.balance += amount;
    this.updatedAt = new Date();
    this.apply(Object.assign(new DepositedEvent(), this));
  }

  close(password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (this.balance > 0)
      throw new UnprocessableEntityException(
        ErrorMessage.ACCOUNT_BALANCE_IS_REMAINED,
      );
    this.updatedAt = new Date();
    this.apply(Object.assign(new AccountClosedEvent(), this));
  }

  private comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
