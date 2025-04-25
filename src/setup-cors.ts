import { INestApplication } from '@nestjs/common';

export function setupCors(app: INestApplication) {
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: '*', // Allow all headers

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
}
