import { BaseService } from './base.service';
import { Product } from '../models';

export class ProductsService extends BaseService<Product> {
  constructor() {
    super('products');
  }
}

