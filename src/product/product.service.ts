import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct, Product } from 'src/database/product.schemes';
import { ProductDTO } from './dto/createProduct.dto';
import { UpdateDTO } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productSchemes: Model<IProduct>,
  ) {}

  async create(dto: ProductDTO) {
    const productDB = await this.productSchemes.findOne({ name: dto.name });
    if (productDB)
      throw new BadRequestException('This product is already exist in DB');
    try {
      const product = await this.productSchemes.create(dto);
      return {
        name: product.name,
        productId: product.productId,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async search(search: string) {
    const products = await this.productSchemes.find({
      name: { $regex: search },
    });

    return products;
  }

  async delete(productId: string) {
    try {
      const product = await this.productSchemes.deleteOne({
        productId: productId,
      });
      return {
        ...product,
        message: 'Success',
      };
    } catch {
      throw new BadRequestException('This product doesn`t exist in DB');
    }
  }

  async findById(id: string) {
    const product = this.productSchemes.findOne({ productId: id });
    if (!product)
      throw new BadRequestException('This product isn`t exist in DB');

    try {
      return product;
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(dto: UpdateDTO) {
    try {
      return await this.productSchemes.findOneAndUpdate(
        { productId: dto.productId },
        {
          $set: {
            price: dto.price,
            brand: dto.brand,
            category: dto.category,
            count: dto.count,
            desc: dto.desc,
            name: dto.name,
          },
        },
        { new: true },
      );
    } catch {
      throw new BadRequestException('Cannot update document');
    }
  }

  async findAll() {
    return await this.productSchemes.find();
  }
}
