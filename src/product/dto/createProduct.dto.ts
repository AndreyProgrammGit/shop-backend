import { IsNotEmpty, MinLength, IsNumber, IsIn } from 'class-validator';
import { IProductDTO } from '../types/Dtos';

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

export class ProductDTO implements IProductDTO {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @MinLength(9)
  desc: string;

  @IsNotEmpty()
  @IsIn(categories, {
    message: 'Category must be one of the predefined values',
  })
  category: (typeof categories)[number];

  @IsNotEmpty()
  @IsIn(brands, { message: 'Brand must be one of the predefined values' })
  brand: (typeof brands)[number];
}
