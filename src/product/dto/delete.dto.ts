import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IDeleteDTO } from '../types/Dtos';

export class DeleteDTO implements IDeleteDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;
}
