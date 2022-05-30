import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ConsoleLogger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const logger = new ConsoleLogger('main');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Starter Service')
      .setDescription('Api documentation for starter service apis')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/documentation', app, document);
  }

  await app.listen(process.env.PORT as string);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
