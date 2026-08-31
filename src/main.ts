import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { useGlobalPipes } from './config/useGloblapipes';
import { setGlobalPrefix } from './config/setGlobalPrefix.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  CORS
  corsConfig(app);
  // 1. Enable Validation Pipe (Required for DTOs to work)
  useGlobalPipes(app);

  // 2. Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('MATER DEI NYANZA API')
    .setDescription(
      'API documentation for the Mater dei nyanza management system',
    )
    .setVersion('1.0')
    .addTag('MATER DEI NYANZA', 'MATER DEI  management endpoints')
    .build();

  // 3. Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);
  // 4. Setup Swagger UI at the '/api' endpoint
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps auth token on page refresh
      tagsSorter: 'alpha', // Sorts tags alphabetically
      operationsSorter: 'alpha', // Sorts endpoints alphabetically
    },
  });

  // Optional: Set a global prefix if your API is under /v1 or /api
  setGlobalPrefix(app);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/mdapi`);
  console.log(`Swagger UI is available at: ${await app.getUrl()}/api`);
}

bootstrap();
