import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginrDto } from './dto/login.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const user = await this.userService.create(body.email, body.password);
    return { email: user.email };
  }

  @Post('/login')
  async login(@Body() body: LoginrDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new BadRequestException({
        status: 400,
        message: 'Email or Password is incorrect',
      });
    }
    return this.authService.login(user);
  }
}
