import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from 'src/app.module';
import { IProducts, Product } from 'src/database/product.schemes';

async function productPopulate() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productModel = app.get<Model<IProducts>>(getModelToken(Product.name));

  const products: IProducts[] = [
    {
      name: 'Smartphone X1',
      productId: 101,
      count: 50,
      price: 699,
      desc: 'Latest smartphone with AMOLED display and fast processor.',
      category: 'Electronics',
      brand: 'TechBrand',
    },
    {
      name: 'Wireless Headphones Pro',
      productId: 102,
      count: 120,
      price: 199,
      desc: 'Noise-cancelling over-ear headphones with long battery life.',
      category: 'Audio',
      brand: 'SoundWave',
    },
    {
      name: 'Gaming Laptop G5',
      productId: 103,
      count: 30,
      price: 1499,
      desc: 'High-performance laptop with RTX graphics card and 16GB RAM.',
      category: 'Computers',
      brand: 'GameTech',
    },
    {
      name: '4K LED TV 55"',
      productId: 104,
      count: 20,
      price: 799,
      desc: 'Ultra HD television with smart features and HDR support.',
      category: 'Electronics',
      brand: 'VisionPlus',
    },
    {
      name: 'Electric Kettle 1.7L',
      productId: 105,
      count: 75,
      price: 49,
      desc: 'Fast-boiling kettle with auto shut-off and boil-dry protection.',
      category: 'Home Appliances',
      brand: 'KitchenMaster',
    },
    {
      name: 'Running Shoes AirFlex',
      productId: 106,
      count: 200,
      price: 120,
      desc: 'Lightweight and comfortable running shoes with breathable mesh.',
      category: 'Sportswear',
      brand: 'SpeedRun',
    },
    {
      name: 'Smartwatch Series 7',
      productId: 107,
      count: 90,
      price: 299,
      desc: 'Fitness tracker and smartwatch with heart rate monitor.',
      category: 'Wearables',
      brand: 'TimeTech',
    },
    {
      name: 'Coffee Maker Deluxe',
      productId: 108,
      count: 40,
      price: 249,
      desc: 'Automatic drip coffee maker with programmable timer and grinder.',
      category: 'Kitchen Appliances',
      brand: 'BrewMaster',
    },
  ];

  await productModel.deleteMany({});

  for (const p of products) {
    await productModel.create(p);
  }

  console.log('✅ Product collection seeded!');
  await app.close();
}

productPopulate();
