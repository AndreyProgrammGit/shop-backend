import { FilterDTO } from '../dto/filter.dto';
import { IProductFindOptions } from './types/IProductFindOptions';
import { IProductFindPipe } from './types/IProductFindPipe';

export class ProductCategoriesPipe implements IProductFindPipe<'categories'> {
  key = 'categories' as const;

  execute(dto: FilterDTO, options: IProductFindOptions) {
    const order = dto.sort === 'asc' ? 1 : -1;
    options.filters.push({ category: { $in: dto.categories } });
    options.options.sort.push({ price: order });

    return options;
  }
}
