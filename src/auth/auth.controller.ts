import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import type { Request, Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() body: RegisterDTO) {
    const userDB = await this.userService.findByEmail(body.email);
    if (userDB) throw new BadRequestException('Email must be unique');
    const user = await this.userService.create(body);
    return await this.authService.register(user, body);
  }

  @Post('/login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException({
        message: 'Email or Password is incorrect',
      });
    }
    return await this.authService.login(user, body, res);
  }

  @Post('/refresh')
  async refresh(
    @Res() res: Response,
    @Req() req: Request,
    @Headers('Authorization') accessToken: string,
  ) {
    return await this.authService.refreshTokens(
      {
        accessToken: accessToken,
        refreshToken: req.cookies['refreshToken'],
      },
      res,
    );
  }
}
