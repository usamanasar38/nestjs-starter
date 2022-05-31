import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventStoreImplement } from '@account/infrastructure/cache/event-store';
import { IntegrationEventPublisherImplement } from '@account/infrastructure/message/integration-event.publisher';
import { AccountQueryImplement } from '@account/infrastructure/query/account.query';
import { AccountRepositoryImplement } from '@account/infrastructure/repository/account.repository';

import { AccountsController } from '@account/interface/accounts.controller';

import { CloseAccountHandler } from '@account/application/command/close-account.handler';
import { DepositHandler } from '@account/application/command/deposit.handler';
import { OpenAccountHandler } from '@account/application/command/open-account.handler';
import { RemitHandler } from '@account/application/command/remit.handler';
import { UpdatePasswordHandler } from '@account/application/command/update-password.handler';
import { WithdrawHandler } from '@account/application/command/withdraw.handler';
import { AccountClosedHandler } from '@account/application/event/account-closed.handler';
import { AccountOpenedHandler } from '@account/application/event/account-opened.handler';
import { DepositedHandler } from '@account/application/event/deposited.handler';
import { PasswordUpdatedHandler } from '@account/application/event/password-updated.handler';
import { WithdrawnHandler } from '@account/application/event/withdrawn.handler';
import { FindAccountByIdHandler } from '@account/application/query/find-account-by-id.handler';
import { FindAccountsHandler } from '@account/application/query/find-accounts.handler';

import { AccountService } from '@account/domain/service';
import { AccountFactory } from '@account/domain/factory';
import { InjectionToken } from './application/injection.token';
import { PrismaService } from '@common/infrastructure/services/prisma.service';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.ACCOUNT_REPOSITORY,
    useClass: AccountRepositoryImplement,
  },
  {
    provide: InjectionToken.INTEGRATION_EVENT_PUBLISHER,
    useClass: IntegrationEventPublisherImplement,
  },
  {
    provide: InjectionToken.EVENT_STORE,
    useClass: EventStoreImplement,
  },
  {
    provide: InjectionToken.ACCOUNT_QUERY,
    useClass: AccountQueryImplement,
  },
];

const application = [
  CloseAccountHandler,
  DepositHandler,
  OpenAccountHandler,
  RemitHandler,
  UpdatePasswordHandler,
  WithdrawHandler,
  AccountClosedHandler,
  AccountOpenedHandler,
  DepositedHandler,
  PasswordUpdatedHandler,
  WithdrawnHandler,
  FindAccountByIdHandler,
  FindAccountsHandler,
];

const domain = [AccountService, AccountFactory];

@Module({
  imports: [CqrsModule],
  controllers: [AccountsController],
  providers: [
    Logger,
    ...infrastructure,
    ...application,
    ...domain,
    PrismaService,
  ],
})
export class AccountsModule {}
