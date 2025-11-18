import { FilterDTO } from '../dto/filter.dto';
import { TBrand } from '../types/Dtos';
import { IProductFindOptions } from './types/IProductFindOptions';
import { IProductFindPipe } from './types/IProductFindPipe';

export class ProductBrandsPipe implements IProductFindPipe<'brands'> {
  key = 'brands' as const;

  execute(dto: FilterDTO, options: IProductFindOptions) {
    const order = dto.sort === 'asc' ? 1 : -1;
    options.filters.push({ brand: { $in: dto.brands } });
    options.options.sort.push({ price: order });

    return options;
  }
}
