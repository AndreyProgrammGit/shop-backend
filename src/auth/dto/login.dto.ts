import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginrDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
