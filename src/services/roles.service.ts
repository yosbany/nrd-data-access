import { BaseService } from './base.service';
import { Role } from '../models';

export class RolesService extends BaseService<Role> {
  constructor() {
    super('roles');
  }
}

