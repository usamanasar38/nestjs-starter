import { Injectable, Logger } from '@nestjs/common';
import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from '@account/application/event/integration';

@Injectable()
export class IntegrationEventPublisherImplement
  implements IntegrationEventPublisher
{
  private logger = new Logger(IntegrationEventPublisherImplement.name);

  async publish(message: IntegrationEvent): Promise<void> {
    this.logger.log(message);
    await Promise.resolve();
  }
}
