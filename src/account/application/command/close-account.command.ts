import { ICommand } from '@nestjs/cqrs';

export class CloseAccountCommand implements ICommand {
  constructor(readonly id: number, readonly password: string) {}
}
