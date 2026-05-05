import { BaseService } from './base.service';
import { Vacation } from '../models';

export class VacationsService extends BaseService<Vacation> {
  constructor() {
    super('vacations');
  }
}
