import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { ProductModel } from './product/product.model';
import { TelegramUserModule } from './telegram-user/telegram-user.module';
import KeyvRedis, { Keyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [new KeyvRedis('redis://localhost:6379')],
        };
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot('mongodb://admin:password123@localhost:27017', {
      dbName: 'shop',
      autoIndex: true,
    }),

    AuthModule,
    ProductModule,
    UserModule,
    TelegramUserModule,
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, ProductService, ProductModel],
})
export class AppModule {}
