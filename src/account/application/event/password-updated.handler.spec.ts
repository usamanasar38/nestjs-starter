import { Logger, ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PasswordUpdatedHandler } from '@account/application/event/password-updated.handler';
import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from '@account/application/event/integration';
import { InjectionToken } from '@account/application/injection.token';

import { PasswordUpdatedEvent } from '@account/domain/event/password-updated.event';

describe('PasswordUpdatedHandler', () => {
  let handler: PasswordUpdatedHandler;
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
      PasswordUpdatedHandler,
      loggerProvider,
      publisherProvider,
      storeProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(PasswordUpdatedHandler);
    logger = testModule.get(Logger);
    publisher = testModule.get(InjectionToken.INTEGRATION_EVENT_PUBLISHER);
    store = testModule.get(InjectionToken.EVENT_STORE);
  });

  describe('handle', () => {
    it('should handle PasswordUpdated', async () => {
      const logMock = jest.fn();
      logger.log = logMock;
      publisher.publish = jest.fn();
      store.save = jest.fn();

      const event = { id: 1 } as PasswordUpdatedEvent;

      await expect(handler.handle(event)).resolves.toEqual(undefined);
      expect(logMock).toBeCalledTimes(1);
      expect(logMock).toBeCalledWith(
        `${IntegrationEventSubject.PASSWORD_UPDATED}: ${JSON.stringify(event)}`,
      );
      expect(publisher.publish).toBeCalledTimes(1);
      expect(publisher.publish).toBeCalledWith({
        subject: IntegrationEventSubject.PASSWORD_UPDATED,
        data: { id: event.id },
      });
      expect(store.save).toBeCalledTimes(1);
      expect(store.save).toBeCalledWith({
        subject: IntegrationEventSubject.PASSWORD_UPDATED,
        data: event,
      });
    });
  });
});
