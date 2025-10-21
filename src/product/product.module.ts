import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchemes } from '../database/product.schemes';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductModel } from './product.model';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchemes }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductModel],
  exports: [MongooseModule],
})
export class ProductModule {}
