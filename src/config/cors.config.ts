import { INestApplication } from '@nestjs/common';

export const corsConfig = (app: INestApplication) => {
  app.enableCors({
    origin: true, // Allows all localhost origins (safe for development)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
};
