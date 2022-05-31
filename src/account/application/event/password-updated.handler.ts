import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from '@account/application/event/integration';
import { InjectionToken } from '@account/application/injection.token';

import { PasswordUpdatedEvent } from '@account/domain/event/password-updated.event';

@EventsHandler(PasswordUpdatedEvent)
export class PasswordUpdatedHandler
  implements IEventHandler<PasswordUpdatedEvent>
{
  constructor(
    private readonly logger: Logger,
    @Inject(InjectionToken.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
    @Inject(InjectionToken.EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  async handle(event: PasswordUpdatedEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.PASSWORD_UPDATED}: ${JSON.stringify(event)}`,
    );
    await this.publisher.publish({
      subject: IntegrationEventSubject.PASSWORD_UPDATED,
      data: { id: event.id },
    });
    await this.eventStore.save({
      subject: IntegrationEventSubject.PASSWORD_UPDATED,
      data: event,
    });
  }
}
