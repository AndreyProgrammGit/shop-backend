import { FilterDTO } from '../../dto/filter.dto';
import { IProductFindOptions } from './IProductFindOptions';

type TProductBrandsPipeKeys = 'categories' | 'brands' | 'price';

export interface IProductFindPipe<T extends TProductBrandsPipeKeys> {
  key: T;
  execute(dto: FilterDTO, options: IProductFindOptions): IProductFindOptions;
}
