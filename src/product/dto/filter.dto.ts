import {
  IsArray,
  IsDivisibleBy,
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';
import type { IFilterDTO, TBrand, TCategory } from '../types/Dtos';
import { Transform, Type } from 'class-transformer';

export const categories = [
  'Electronics',
  'Audio',
  'Computers',
  'Home Appliances',
  'Sportswear',
  'Wearables',
  'Kitchen Appliances',
] as const;

export const brands = [
  'TechBrand',
  'SoundWave',
  'GameTech',
  'VisionPlus',
  'KitchenMaster',
  'SpeedRun',
  'TimeTech',
  'BrewMaster',
] as const;

const limits = [3, 6, 9, 18];

export class FilterDTO implements IFilterDTO {
  @IsOptional()
  sort: 'asc' | 'desc' | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsIn(limits, {
    message: 'limit must be one of the predefined values: 3, 6, 9, 18',
  })
  limit: number = limits[0];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsDivisibleBy(3, { message: 'Offset must be a multiple of 3.' })
  offset: number = 0;

  @IsOptional()
  @Transform((input) => {
    const categories = input.value;
    return Array.isArray(categories) ? categories : [categories];
  })
  @IsArray()
  @IsIn(categories, {
    each: true,
    message: 'Category must be one of the predefined values',
  })
  categories: TCategory[];

  @IsOptional()
  @Transform((input) => {
    const brands = input.value;
    return Array.isArray(brands) ? brands : [brands];
  })
  @IsArray()
  @IsIn(brands, {
    each: true,
    message: 'Brand must be one of the predefined values',
  })
  brands: TBrand[];

  @IsOptional()
  @Transform((input) => {
    return Number(input.value);
  })
  @IsNumber()
  price: number;
}
