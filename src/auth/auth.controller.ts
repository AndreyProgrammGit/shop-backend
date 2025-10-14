import {
  BadRequestException,
  Body,
  Controller,
  Header,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const user = await this.userService.create(body);
    return await this.authService.register(user, body);
  }

  @Post('/login')
  async login(@Body() body: LoginDTO) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException({
        message: 'Email or Password is incorrect',
      });
    }
    return await this.authService.login(user, body);
  }

  @Post('/refresh')
  async refresh(
    @Body() body: { refreshToken: string },
    @Headers('Authorization') accessToken: string,
  ) {
    return await this.authService.refreshTokens({
      accessToken: accessToken,
      refreshToken: body.refreshToken,
    });
  }
}
