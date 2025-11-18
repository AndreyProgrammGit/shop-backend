import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { IProduct, Product } from '../database/product.schemes';
import { enumProducts } from './enumProduct';

type TProductSeed = Omit<IProduct, 'productId'>;

async function productPopulate() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productModel = app.get<Model<IProduct>>(getModelToken(Product.name));

  const products: TProductSeed[] = enumProducts;
  await productModel.deleteMany({});

  for (const p of products) {
    await productModel.create(p);
  }

  console.log('✅ Product collection seeded!');
  await app.close();
}

productPopulate();
