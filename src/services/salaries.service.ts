import { BaseService } from './base.service';
import { Salary } from '../models';

export class SalariesService extends BaseService<Salary> {
  constructor() {
    super('salaries');
  }
}
