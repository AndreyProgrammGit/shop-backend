import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchemes } from 'src/database/product.schemes';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchemes }]),
  ],
  providers: [ProductService],
  exports: [MongooseModule],
})
export class ProductModule {}
