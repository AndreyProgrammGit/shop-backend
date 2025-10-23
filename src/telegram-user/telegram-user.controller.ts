import { Controller, Get, Headers } from '@nestjs/common';
import { TelegramUserInfoDTO } from './dto/telegramUserInfo.dto';
import { TelegramUserService } from './telegram-user.service';

@Controller('telegram-user')
export class TelegramUserController {
  constructor(private telegramUserService: TelegramUserService) {}

  @Get('/')
  async telegramUserInfo(@Headers('Authorization') token: string) {
    return await this.telegramUserService.telegramUserInfo(token);
  }
}
