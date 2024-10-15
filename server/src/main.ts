import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';

async function bootstrap() {
  dotenv.config();
  
  const app = await NestFactory.create(AppModule);

  // Middleware để tăng kích thước payload
  app.use(json({ limit: '10mb' })); // Thay '10mb' bằng kích thước bạn cần
  app.use(urlencoded({ limit: '10mb', extended: true })); // Thay '10mb' bằng kích thước bạn cần

  // Cấu hình CORS
  app.enableCors({
    origin: process.env.NEXT_ORIGIN,
    methods: 'GET, POST, PUT, PATCH, DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization'
  });

  await app.listen(3000);
}
bootstrap();
