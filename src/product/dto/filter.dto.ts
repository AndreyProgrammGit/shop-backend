import {
  IsArray,
  IsDivisibleBy,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import type { IFilterDTO, TBrand, TCategory } from '../types/Dtos';
import { Transform } from 'class-transformer';

const categories = [
  'Electronics',
  'Audio',
  'Computers',
  'Home Appliances',
  'Sportswear',
  'Wearables',
  'Kitchen Appliances',
] as const;

const brands = [
  'TechBrand',
  'SoundWave',
  'GameTech',
  'VisionPlus',
  'KitchenMaster',
  'SpeedRun',
  'TimeTech',
  'BrewMaster',
] as const;

const limits = [9, 18];

export class FilterDTO implements IFilterDTO {
  @IsOptional()
  @IsNumber()
  @IsIn(limits, {
    message: 'Brand must be one of the predefined values',
  })
  limit: number = limits[0];

  @IsOptional()
  @IsNumber()
  @IsDivisibleBy(9, { message: 'Offset must be a multiple of 5.' })
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
