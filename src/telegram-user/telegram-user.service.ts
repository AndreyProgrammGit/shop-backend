import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ITelegramUser, TelegramUser } from '../database/telegramUser.schemes';
import { Model } from 'mongoose';
import { ITelegramUserInfoDTO } from './types/Dtos';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/types/ValidatePayload';

@Injectable()
export class TelegramUserService {
  constructor(
    @InjectModel(TelegramUser.name)
    private telegramUserSchema: Model<ITelegramUser>,
    private jwtService: JwtService,
  ) {}

  async telegramUserInfo(token: string) {
    const parseToken = token.split(' ')[1];
    const decodeToken: JwtPayload = this.jwtService.decode(parseToken);

    const user = await this.telegramUserSchema.findOne({
      _id: decodeToken.sub,
    });

    if (!user) {
      throw new BadRequestException('Invalid user - user doesn`t exist in DB');
    }

    return user;
  }
}
