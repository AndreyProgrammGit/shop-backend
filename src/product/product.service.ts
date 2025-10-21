import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.model';
import {
  IDeleteDTO,
  IFilterDTO,
  IProductDTO,
  ISearchDTO,
  IUpdateDTO,
} from './types/Dtos';

@Injectable()
export class ProductService {
  constructor(private productModel: ProductModel) {}

  async filterBy(dto: IFilterDTO) {
    return this.productModel.filterBy(dto);
  }

  async create(dto: IProductDTO) {
    return this.productModel.create(dto);
  }

  async search(dto: ISearchDTO) {
    return this.productModel.search(dto);
  }

  async delete(dto: IDeleteDTO) {
    return this.productModel.delete(dto);
  }

  async findById(id: string) {
    return this.findById(id);
  }

  async update(dto: IUpdateDTO) {
    return this.productModel.update(dto);
  }

  async findAll() {
    return this.productModel.findAll();
  }
}
