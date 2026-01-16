import { BaseService } from './base.service';
import { License } from '../models';

export class LicensesService extends BaseService<License> {
  constructor() {
    super('licenses');
  }
}
