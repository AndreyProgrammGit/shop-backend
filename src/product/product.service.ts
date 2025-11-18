import { Inject, Injectable } from '@nestjs/common';
import { ProductModel } from './product.model';
import {
  IDeleteDTO,
  IFilterDTO,
  IProductDTO,
  IProductsCartDTO,
  ISearchDTO,
  IUpdateDTO,
} from './types/Dtos';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    private productModel: ProductModel,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async filterBy(dto: IFilterDTO) {
    return this.productModel.filterBy(dto);
  }

  async create(dto: IProductDTO) {
    await this.invalidateProductCache();
    return this.productModel.create(dto);
  }

  async search(dto: ISearchDTO) {
    return this.productModel.search(dto);
  }

  async delete(dto: IDeleteDTO) {
    return this.productModel.delete(dto);
  }

  async findById(id: string) {
    return this.productModel.findById(id);
  }

  async update(dto: IUpdateDTO) {
    return this.productModel.update(dto);
  }

  async findProductsFromCart(dto: IProductsCartDTO) {
    return this.productModel.productsCart(dto);
  }

  async findAll() {
    return this.productModel.findAll();
  }

  private async invalidateProductCache() {
    const redis = (this.cacheManager as any).store.client;
    const keys = await redis.keys('products:*');
    if (keys.length) {
      await redis.del(keys);
      console.log(`🧹 Cache invalidated for ${keys.length} keys`);
    }
  }
}
