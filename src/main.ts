import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const prfix = 'mdapi';
  app.setGlobalPrefix(prfix);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `🚀🚀Server Start On http://localhost:${process.env.PORT ?? 3000}/${prfix}`,
    );
  });
}
bootstrap();
