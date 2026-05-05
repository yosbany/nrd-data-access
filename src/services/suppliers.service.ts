import { BaseService } from './base.service';
import { Supplier } from '../models';

export class SuppliersService extends BaseService<Supplier> {
  constructor() {
    super('suppliers');
  }
}
