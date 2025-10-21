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
import { AuthGuard } from '../auth/auth.guard';
import { ProductDTO } from './dto/createProduct.dto';
import { UpdateDTO } from './dto/updateProduct.dto';
import { FilterDTO } from './dto/filter.dto';
import { SearchDTO } from './dto/search.dto';
import { DeleteDTO } from './dto/delete.dto';

@Controller('/products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async filterProduct(@Query() dto: FilterDTO) {
    return await this.productService.filterBy(dto);
  }

  @Post('/create')
  async createProduct(@Body() dto: ProductDTO) {
    return await this.productService.create(dto);
  }

  @Get('/search')
  async searchProduct(@Query('search') dto: SearchDTO) {
    return await this.productService.search(dto);
  }

  @Delete('/destroy')
  async destroyProduct(@Body() dto: DeleteDTO) {
    return await this.productService.delete(dto);
  }

  @Patch('/update')
  async updateProduct(@Body() body: UpdateDTO) {
    return await this.productService.update(body);
  }

  @Get('/product/:id')
  async findProductById(@Param('id') id: string) {
    return await this.productService.findById(id);
  }
}
