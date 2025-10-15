import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductDTO } from './dto/createProduct.dto';
import { UpdateDTO } from './dto/updateProduct.dto';

@Controller('/product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create')
  async createProduct(@Body() dto: ProductDTO) {
    return await this.productService.create(dto);
  }

  @Get('/search')
  async searchProduct(@Query('search') search: string) {
    return await this.productService.search(search);
  }

  @Delete('/destroy')
  async destroyProduct(@Body() body: { productId: string }) {
    return await this.productService.delete(body.productId);
  }

  @Patch('/update')
  async updateProduct(@Body() body: UpdateDTO) {
    return await this.productService.update(body);
  }

  @Get('/find/:id')
  async findProductById(@Param('id') id: string) {
    return await this.productService.findById(id);
  }

  @Get('/getAll')
  async getAllProducts() {
    return await this.productService.findAll();
  }
}
