import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IRegisterDTO } from '../types/Dtos';

export class RegisterDTO implements IRegisterDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
