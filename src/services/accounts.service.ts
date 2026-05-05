import { BaseService } from './base.service';
import { Account } from '../models';

export class AccountsService extends BaseService<Account> {
  constructor() {
    super('accounts');
  }
}

