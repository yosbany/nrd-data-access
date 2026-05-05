import { BaseService } from './base.service';
import { Contract } from '../models';

export class ContractsService extends BaseService<Contract> {
  constructor() {
    super('contracts');
  }
}

