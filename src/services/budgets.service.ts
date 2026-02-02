import { BaseService } from './base.service';
import { Budget } from '../models';

export class BudgetsService extends BaseService<Budget> {
  constructor() {
    super('budgets');
  }
}
