import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { IProductsCartDTO } from '../types/Dtos';
import { Transform } from 'class-transformer';

export class ProductsCartDTO implements IProductsCartDTO {
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  productIds: string[];
}
