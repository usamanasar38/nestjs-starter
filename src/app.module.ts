import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/infrastructure/http/middleware/logger.middleware';
import { AppService } from './app.service';
import { HealthCheckController } from './common/application/controllers/health-check.controller';
import configuration from './common/infrastructure/config/configuration';
import { validate } from './common/infrastructure/config/env.validation';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], validate })],
  controllers: [HealthCheckController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
