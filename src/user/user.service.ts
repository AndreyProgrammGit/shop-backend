import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from '../database/user.schemas';
import type { IRegisterDTO } from '../auth/types/Dtos';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/types/ValidatePayload';
import { ITelegramUser, TelegramUser } from '../database/telegramUser.schemes';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<IUser>,
    @InjectModel(TelegramUser.name)
    private telegramUserSchema: Model<ITelegramUser>,
    private jwtService: JwtService,
  ) {}

  async create(dto: IRegisterDTO): Promise<IUser> {
    const user = await this.userSchema.create({
      email: dto.email,
      name: dto.name,
      surname: dto.surname,
      old: dto.old,
      city: dto.city,
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userSchema.findOne({ email }).exec();
  }

  async userInfo(token: string) {
    const tokenWithoutBearer = token.split(' ');
    const decoding: JwtPayload = await this.jwtService.decode(
      tokenWithoutBearer[1],
    );

    console.log(decoding, 'decoding');
    // const user = await this.userSchema.findOne({ userId: decoding.sub });

    // if (!user) {
    //   throw new UnauthorizedException('Invalid user');
    // }

    const user = await this.telegramUserSchema.findOne({
      _id: decoding.sub,
    });

    console.log(user, 'user');

    return {
      username: user?.username,
      firstname: user?.firstName,
      lastname: user?.lastName,
    };

    // return {
    //   email: user.email,
    //   name: user.name,
    //   surname: user.surname,
    //   old: user.old,
    //   city: user.city,
    // };
  }
}
