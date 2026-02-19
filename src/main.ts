import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Validation (checks DTOs)
  app.useGlobalPipes(new ValidationPipe());

  // 2. Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Rapid Rise Backend')
    .setDescription('The API description for the assignment')
    .setVersion('1.0')
    .addBearerAuth() // Adds the "Authorize" button for JWT later
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Access at /api

  await app.listen(3000);
}
bootstrap();