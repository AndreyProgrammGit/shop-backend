import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/user.schemas';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import {
  TelegramUser,
  TelegramUserSchema,
} from '../database/telegramUser.schemes';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TelegramUser.name, schema: TelegramUserSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
