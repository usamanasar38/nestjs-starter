import { ICommand } from '@nestjs/cqrs';

class Properties {
  readonly id: number;
  readonly password: string;
  readonly amount: number;
}

export class DepositCommand extends Properties implements ICommand {
  constructor(properties: Properties) {
    super();
    Object.assign(this, properties);
  }
}