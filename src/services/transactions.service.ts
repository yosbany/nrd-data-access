import { BaseService } from './base.service';
import { Transaction } from '../models';

export class TransactionsService extends BaseService<Transaction> {
  constructor() {
    super('transactions');
  }
}

