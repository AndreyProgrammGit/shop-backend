import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProducts, Product } from 'src/database/product.schemes';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productSchemes: Model<IProducts>,
  ) {}

  async findAll() {
    return await this.productSchemes.find();
  }
}
