import { BaseService } from './base.service';
import { CompanyInfo } from '../models';

export class CompanyInfoService extends BaseService<CompanyInfo> {
  constructor() {
    super('companyInfo');
  }
}

