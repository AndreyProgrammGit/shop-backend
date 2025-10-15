import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { IRegisterDTO } from '../types/Dtos';
import { Type } from 'class-transformer';

export class RegisterDTO implements IRegisterDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @MinLength(3)
  surname: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(16)
  @Max(100)
  old: number;
}
