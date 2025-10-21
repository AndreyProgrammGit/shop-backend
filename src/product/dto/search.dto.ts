import { IsNotEmpty, IsString } from 'class-validator';
import { ISearchDTO } from '../types/Dtos';

export class SearchDTO implements ISearchDTO {
  @IsNotEmpty()
  @IsString()
  search: string;
}
