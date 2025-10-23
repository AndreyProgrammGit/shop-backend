import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../database/auth.schemes';
import { Tokens, TokensSchema } from '../database/tokens.schemes';
import { TelegramUserModule } from '../telegram-user/telegram-user.module';
import {
  TelegramUser,
  TelegramUserSchema,
} from '../database/telegramUser.schemes';

@Module({
  imports: [
    UserModule,
    TelegramUserModule,
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: Tokens.name, schema: TokensSchema },
      { name: TelegramUser.name, schema: TelegramUserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback_secret',
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
