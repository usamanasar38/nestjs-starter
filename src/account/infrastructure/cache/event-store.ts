import { Logger } from '@nestjs/common';
import { Event, EventStore } from '@account/application/event/integration';

export class EventStoreImplement implements EventStore {
  private logger = new Logger(EventStoreImplement.name);

  async save(event: Event): Promise<void> {
    this.logger.log(event.data.id, JSON.stringify(event.data));
    await Promise.resolve();
  }

  async set(key: string, value: string): Promise<void> {
    this.logger.log(key, value);
    await Promise.resolve();
  }

  async get(key: string): Promise<string | null> {
    return Promise.resolve(key);
  }
}
