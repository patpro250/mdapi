import { INestApplication, ValidationPipe } from '@nestjs/common';

export const useGlobalPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );
};
