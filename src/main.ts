import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cacheManager = app.get(CACHE_MANAGER);

  const store: any = (cacheManager as any).store;
  console.log('store keys:', Object.keys(store || {}));
  console.log('redis client exists:', !!store?.client);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: [
      'https://dth0gn02-3000.euw.devtunnels.ms',
      'https://t.me/som3thing_shopBot/mybotshop',
      'https://t.me',
      'https://web.telegram.org',
      'https://*.t.me',
      'https://*.telegram.org',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(1488);
}
bootstrap();
