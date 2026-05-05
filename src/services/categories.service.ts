import { BaseService } from './base.service';
import { Category } from '../models';

export class CategoriesService extends BaseService<Category> {
  constructor() {
    super('categories');
  }
}

