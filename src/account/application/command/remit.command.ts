import { ICommand } from '@nestjs/cqrs';

class Properties {
  readonly id: number;
  readonly receiverId: number;
  readonly amount: number;
  readonly password: string;
}

export class RemitCommand extends Properties implements ICommand {
  constructor(properties: Properties) {
    super();
    Object.assign(this, properties);
  }
}
