import { BaseService } from './base.service';
import { LaborRole } from '../models';

export class LaborRolesService extends BaseService<LaborRole> {
  constructor() {
    super('labor-roles');
  }
}
