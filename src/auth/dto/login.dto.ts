import { IsEmail, IsNotEmpty } from 'class-validator';
import { ILoginDTO } from '../types/Dtos';

export class LoginDTO implements ILoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
