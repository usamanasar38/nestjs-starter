import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from '@account/application/event/integration';
import { InjectionToken } from '@account/application/injection.token';

import { DepositedEvent } from '@account/domain/event/deposited.event';

@EventsHandler(DepositedEvent)
export class DepositedHandler implements IEventHandler<DepositedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(InjectionToken.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
    @Inject(InjectionToken.EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  async handle(event: DepositedEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.DEPOSITED}: ${JSON.stringify(event)}`,
    );
    await this.publisher.publish({
      subject: IntegrationEventSubject.DEPOSITED,
      data: { id: event.id },
    });
    await this.eventStore.save({
      subject: IntegrationEventSubject.DEPOSITED,
      data: event,
    });
  }
}
