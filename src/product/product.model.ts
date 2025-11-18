import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct, Product } from '../database/product.schemes';
import { ProductDTO } from './dto/createProduct.dto';
import { UpdateDTO } from './dto/updateProduct.dto';
import { brands, categories, FilterDTO } from './dto/filter.dto';
import { SearchDTO } from './dto/search.dto';
import { DeleteDTO } from './dto/delete.dto';
import { IProductsCartDTO } from './types/Dtos';
import { ProductBrandsPipe } from './pipes/ProductBrandsPipe';
import { ProductCategoriesPipe } from './pipes/ProductCategoriesPipe';
import { ProductPricePipe } from './pipes/ProductPricePipe';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const PRODUCTS_CACHE_COUNT = 'count';
const PRODUCTS_CACHE_LIST = 'list';

@Injectable()
export class ProductModel {
  constructor(
    @InjectModel(Product.name) private productSchemes: Model<IProduct>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async productsCart(dto: IProductsCartDTO) {
    const products = await this.productSchemes.find({
      productId: { $in: dto.productIds },
    });
    if (!products) {
      throw new BadRequestException('In DB it doesn`t exist anything like ');
    }

    return products;
  }

  async filterBy(dto: FilterDTO) {
    const pipes = (
      [
        new ProductBrandsPipe(),
        new ProductCategoriesPipe(),
        new ProductPricePipe(),
      ] as const
    ).filter((pipe) => dto[pipe.key]);

    const { filters, options } = pipes.reduce<any>(
      (acc, pipe) => {
        return pipe.execute(dto, acc);
      },
      {
        filters: [],
        options: { sort: [], skip: dto.offset, limit: dto.limit },
      },
    );

    const cacheable =
      !pipes.length && !options.sort.length && !dto.offset && dto.limit === 9;

    if (cacheable) {
      const cachedProducts =
        await this.cacheManager.get<string>(PRODUCTS_CACHE_LIST);

      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      }
    }

    try {
      const total = await this.productSchemes.countDocuments({ $and: filters });
      const products = await this.productSchemes
        .find({ $and: filters }, null, options)
        .exec();

      const result = { total, products, brands, categories };

      if (cacheable) {
        await this.cacheManager.set(
          PRODUCTS_CACHE_LIST,
          JSON.stringify(result),
          120000,
        );
      }

      return result;
    } catch {
      throw new InternalServerErrorException('Cannot find filters product');
    }
  }

  async create(dto: ProductDTO) {
    const productDB = await this.productSchemes.findOne({ name: dto.name });
    if (productDB)
      throw new BadRequestException('This product already exist in DB');
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
      name: { $regex: dto.search, $options: 'i' },
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
