import { BaseService } from './base.service';
import { Area } from '../models';

export class AreasService extends BaseService<Area> {
  constructor() {
    super('areas');
  }
}

