export interface IProductFindOptions {
  filters: {
    brand?: unknown;
    category?: unknown;
    price?: unknown;
  }[];
  options: {
    sort: {
      price: number;
    }[];
  };
}
