import { FilterDTO } from '../dto/filter.dto';
import { IProductFindOptions } from './types/IProductFindOptions';
import { IProductFindPipe } from './types/IProductFindPipe';

export class ProductPricePipe implements IProductFindPipe<'price'> {
  key = 'price' as const;

  execute(dto: FilterDTO, options: IProductFindOptions) {
    const order = dto.sort === 'asc' ? 1 : -1;
    options.filters.push({ price: { $lte: dto.price } });
    options.options.sort.push({ price: order });

    return options;
  }
}
