import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  login(user: { email: string; _id?: string }) {
    try {
      const payload = { email: user.email, sub: user?._id };
      const access_token = this.jwtService.sign(payload);
      return {
        userId: payload.sub,
        name: payload.email,
        access_token,
        status: 200,
      };
    } catch (error: unknown) {
      return {
        status: 500,
        message: 'Something went wrong',
        errorMessage: error,
      };
    }
  }
}
