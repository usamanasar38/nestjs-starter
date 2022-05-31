import { Logger, ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AccountOpenedHandler } from '@account/application/event/account-opened.handler';
import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from '@account/application/event/integration';
import { InjectionToken } from '@account/application/injection.token';

import { AccountOpenedEvent } from '@account/domain/event/account-opened.event';

describe('AccountOpenedHandler', () => {
  let handler: AccountOpenedHandler;
  let logger: Logger;
  let publisher: IntegrationEventPublisher;
  let store: EventStore;

  beforeEach(async () => {
    const loggerProvider: Provider = {
      provide: Logger,
      useValue: {},
    };
    const publisherProvider: Provider = {
      provide: InjectionToken.INTEGRATION_EVENT_PUBLISHER,
      useValue: {},
    };
    const storeProvider: Provider = {
      provide: InjectionToken.EVENT_STORE,
      useValue: {},
    };
    const providers: Provider[] = [
      AccountOpenedHandler,
      loggerProvider,
      publisherProvider,
      storeProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(AccountOpenedHandler);
    logger = testModule.get(Logger);
    publisher = testModule.get(InjectionToken.INTEGRATION_EVENT_PUBLISHER);
    store = testModule.get(InjectionToken.EVENT_STORE);
  });

  describe('handle', () => {
    it('should handle AccountOpenedEvent', async () => {
      const logMock = jest.fn();
      logger.log = logMock;
      publisher.publish = jest.fn();
      store.save = jest.fn();

      const event = { id: 1 } as AccountOpenedEvent;

      await expect(handler.handle(event)).resolves.toEqual(undefined);
      expect(logMock).toBeCalledTimes(1);
      expect(logMock).toBeCalledWith(
        `${IntegrationEventSubject.OPENED}: ${JSON.stringify(event)}`,
      );
      expect(publisher.publish).toBeCalledTimes(1);
      expect(publisher.publish).toBeCalledWith({
        subject: IntegrationEventSubject.OPENED,
        data: { id: event.id },
      });
      expect(store.save).toBeCalledTimes(1);
      expect(store.save).toBeCalledWith({
        subject: IntegrationEventSubject.OPENED,
        data: event,
      });
    });
  });
});
