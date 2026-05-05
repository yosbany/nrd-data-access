import { BaseService } from './base.service';
import { IndirectCost } from '../models';

export class IndirectCostsService extends BaseService<IndirectCost> {
  constructor() {
    super('indirect-costs');
  }
}
