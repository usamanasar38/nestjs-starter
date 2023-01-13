import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.enableCors();
    app.setGlobalPrefix('starter');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) should pass with', () => {
    return request(app.getHttpServer())
      .get('/starter/health-check')
      .expect(200);
  });
});
