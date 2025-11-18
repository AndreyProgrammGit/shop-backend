import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { validate, parse, type InitData } from '@telegram-apps/init-data-node';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../database/user.schemas';
import { RegisterDTO } from './dto/register.dto';
import { ILoginDTO } from './types/Dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, IAuth } from '../database/auth.schemes';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { ITokens, Tokens } from '../database/tokens.schemes';
import { JwtPayload } from './types/ValidatePayload';
import type { Response } from 'express';
import { ITelegramUser, TelegramUser } from '../database/telegramUser.schemes';

@Injectable()
export class AuthService {
  token: string;

  constructor(
    @InjectModel(Auth.name) private authSchema: Model<IAuth>,
    @InjectModel(Tokens.name) private tokensSchema: Model<ITokens>,
    @InjectModel(TelegramUser.name)
    private telegramUserSchema: Model<ITelegramUser>,
    private jwtService: JwtService,
  ) {
    this.token = '7413438070:AAE0szLXVqNbE8kABkzVpKVFPjGc7-10T1w';
  }

  parseToken(accessToken: string) {
    return this.validateToken(accessToken);
  }

  protected async validateToken(accessToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken);
    } catch (error) {
      if (error.message === 'is expired') {
        throw new UnauthorizedException('Token is expired');
      } else {
        throw new UnauthorizedException('Token is invalid');
      }
    }

    const modelToken = await this.tokensSchema.findOne({
      accessToken,
    });

    if (modelToken == null) {
      throw new UnauthorizedException('Token is invalid');
    }

    return payload;
  }

  // async register(user: IUser, dto: RegisterDTO) {
  //   const hashedPassword = await bcrypt.hash(dto.password, 10);
  //   const password = await this.authSchema.create({
  //     userId: user._id,
  //     password: hashedPassword,
  //   });

  //   await password.save();

  //   try {
  //     const tokens = await this.createJWTToken(user);
  //     return {
  //       accessToken: tokens.accessToken,
  //       refreshToken: tokens.refreshToken,
  //     };
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (error: unknown) {
  //     throw new BadRequestException();
  //   }
  // }

  async telegramLogin(initDataRaw: string, res: Response) {
    console.log(initDataRaw);
    validate(initDataRaw, this.token);

    const initData = parse(initDataRaw);

    console.log(initData, 'initData');

    const telegramUser = initData.user;
    if (!telegramUser?.id) {
      throw new BadRequestException('Invalid Telegram user data');
    }

    let user = await this.telegramUserSchema.findOne({
      telegramId: telegramUser.id,
    });
    if (!user) {
      user = await this.telegramUserSchema.create({
        telegramId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name ?? '',
        lastName: telegramUser.last_name ?? '',
      });
    }

    let tokens = await this.tokensSchema.findOne({ userId: user._id });
    let isTokenValid = false;

    if (tokens) {
      try {
        this.jwtService.verify(tokens.accessToken);
        isTokenValid = true;
      } catch {
        isTokenValid = false;
      }
    }

    if (!tokens || !isTokenValid) {
      tokens = await this.createJWTToken(user);
    }

    return res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  // async login(user: IUser, dto: ILoginDTO, res: Response) {
  //   const credentials = await this.authSchema.findOne({ userId: user._id });
  //   if (!credentials) {
  //     throw new BadRequestException('Invalid credentials');
  //   }

  //   const isPasswordValid = await bcrypt.compare(
  //     dto.password,
  //     credentials.password,
  //   );
  //   if (!isPasswordValid) {
  //     throw new BadRequestException('Email or Password is incorrect');
  //   }

  //   let tokens = await this.tokensSchema.findOne({ userId: user._id });

  //   let isTokenValid = false;
  //   if (tokens) {
  //     try {
  //       this.jwtService.verify(tokens.accessToken);
  //       isTokenValid = true;
  //     } catch {
  //       isTokenValid = false;
  //     }
  //   }

  //   if (!tokens || !isTokenValid) {
  //     tokens = await this.createJWTToken(user);
  //   }

  //   res.cookie('refreshToken', tokens.refreshToken, {
  //     httpOnly: true,
  //     sameSite: 'lax',
  //     secure: false,
  //     path: '/',
  //   });

  //   return res.json({
  //     accessToken: tokens.accessToken,
  //     refreshToken: tokens.refreshToken,
  //   });
  // }

  // async refreshTokens(
  //   {
  //     accessToken,
  //     refreshToken,
  //   }: {
  //     accessToken: string;
  //     refreshToken: string;
  //   },
  //   res: Response,
  // ) {
  //   const tokenRecordRef = await this.tokensSchema.findOne({ refreshToken });
  //   const tokenRecordAcc = await this.tokensSchema.findOne({
  //     accessToken: accessToken.split(' ')[1],
  //   });

  //   if (!tokenRecordRef || !tokenRecordAcc) {
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }
  //   const userId = tokenRecordRef.userId;

  //   const payload = { sub: userId };
  //   const newAccessToken = this.jwtService.sign(payload);
  //   const newRefreshToken = randomBytes(128).toString('base64url');

  //   tokenRecordRef.accessToken = newAccessToken;
  //   tokenRecordRef.refreshToken = newRefreshToken;

  //   await tokenRecordRef.save();

  //   res.cookie('refreshToken', newRefreshToken, {
  //     httpOnly: true,
  //     sameSite: 'lax',
  //     secure: false,
  //     path: '/',
  //   });

  //   return res.json({
  //     accessToken: newAccessToken,
  //     refreshToken: newRefreshToken,
  //   });
  // }

  private async createJWTToken(user: ITelegramUser) {
    const payload = { sub: user._id, username: user.username };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '60m' });
    const refreshToken = randomBytes(128).toString('base64url');

    const tokens = await this.tokensSchema.findOneAndUpdate(
      { userId: user._id },
      { accessToken, refreshToken },
      { upsert: true, new: true },
    );

    console.log(tokens);

    return tokens;
  }

  // private async createJWTToken(user: IUser) {
  //   const payload = { sub: user._id, email: user.email };
  //   const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
  //   const refreshToken = randomBytes(128).toString('base64url');

  //   const tokens = await this.tokensSchema.findOneAndUpdate(
  //     { userId: user._id },
  //     { accessToken, refreshToken },
  //     { upsert: true, new: true },
  //   );

  //   return tokens;
  // }
}
