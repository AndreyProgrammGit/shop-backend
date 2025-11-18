export type TCategory =
  | 'Electronics'
  | 'Audio'
  | 'Computers'
  | 'Home Appliances'
  | 'Sportswear'
  | 'Wearables'
  | 'Kitchen Appliances';

export type TBrand =
  | 'TechBrand'
  | 'SoundWave'
  | 'GameTech'
  | 'VisionPlus'
  | 'KitchenMaster'
  | 'SpeedRun'
  | 'TimeTech'
  | 'BrewMaster';

export interface IProductDTO {
  name: string;
  count: number;
  price: number;
  desc: string;
  category: TCategory;
  brand: TBrand;
}

export interface IUpdateDTO {
  productId: string;
  name: string;
  count: number;
  price: number;
  desc: string;
  category: TCategory;
  brand: TBrand;
}

export interface IFilterDTO {
  sort: 'asc' | 'desc' | null;
  categories: TCategory[];
  brands: TBrand[];
  price: number;
  limit: number;
  offset: number;
}

export interface ISearchDTO {
  search: string;
}

export interface IDeleteDTO {
  productId: string;
}

export interface IProductsCartDTO {
  productIds: string[];
}
