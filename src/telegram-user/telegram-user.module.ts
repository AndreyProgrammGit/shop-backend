import { Module } from '@nestjs/common';
import { TelegramUserController } from './telegram-user.controller';
import { TelegramUserService } from './telegram-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TelegramUser,
  TelegramUserSchema,
} from '../database/telegramUser.schemes';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: TelegramUser.name, schema: TelegramUserSchema },
    ]),
  ],
  controllers: [TelegramUserController],
  providers: [TelegramUserService],
})
export class TelegramUserModule {}
