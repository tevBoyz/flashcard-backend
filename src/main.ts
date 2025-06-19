import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.enableCors({
    origin: 'http://localhost:4200', // or '*' to allow all
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  });
  await app.listen(3000);
} 
bootstrap();
