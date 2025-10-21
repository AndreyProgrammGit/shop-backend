import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct, Product } from '../database/product.schemes';
import { ProductDTO } from './dto/createProduct.dto';
import { UpdateDTO } from './dto/updateProduct.dto';
import { FilterDTO } from './dto/filter.dto';
import { SearchDTO } from './dto/search.dto';
import { DeleteDTO } from './dto/delete.dto';
import { TBrand, TCategory } from './types/Dtos';

interface IPipe {
  key: string;
  instruction: Record<string, unknown>;
}

class BrandsPipe implements IPipe {
  key = 'brands' as const;
  instruction: Record<string, unknown>;

  constructor(brands: TBrand[]) {
    this.instruction = {
      brand: {
        $in: brands,
      },
    };
  }
}

class CategoriesPipe implements IPipe {
  key = 'categories' as const;
  instruction: Record<string, unknown>;

  constructor(categories: TCategory[]) {
    this.instruction = {
      category: {
        $in: categories,
      },
    };
  }
}

class PricePipe implements IPipe {
  key = 'price' as const;
  instruction: Record<string, unknown>;

  constructor(price: number) {
    this.instruction = {
      price: {
        $lte: price,
      },
    };
  }
}

@Injectable()
export class ProductModel {
  constructor(
    @InjectModel(Product.name) private productSchemes: Model<IProduct>,
  ) {}

  async filterBy(dto: FilterDTO) {
    const pipes = [
      new BrandsPipe(dto.brands),
      new CategoriesPipe(dto.categories),
      new PricePipe(dto.price),
    ] as const;

    return this.productSchemes
      .find(
        {
          $and: pipes
            .filter((pipe) => dto[pipe.key])
            .map((pipe) => pipe.instruction),
        },
        null,
        {
          $skip: dto.offset,
          $limit: dto.limit,
        },
      )
      .exec();
  }

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

  async search(dto: SearchDTO) {
    const products = await this.productSchemes.find({
      name: { $regex: dto.search },
    });

    return products;
  }

  async delete(dto: DeleteDTO) {
    try {
      const product = await this.productSchemes.deleteOne({
        productId: dto.productId,
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
