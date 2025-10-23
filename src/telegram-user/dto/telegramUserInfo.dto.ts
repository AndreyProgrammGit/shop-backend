import { IsNotEmpty, IsString } from 'class-validator';
import { ITelegramUserInfoDTO } from '../types/Dtos';

export class TelegramUserInfoDTO implements ITelegramUserInfoDTO {
  @IsNotEmpty()
  @IsString()
  telegramUser: string;
}
