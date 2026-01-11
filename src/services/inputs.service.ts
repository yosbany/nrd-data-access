import { BaseService } from './base.service';
import { Input } from '../models';

export class InputsService extends BaseService<Input> {
  constructor() {
    super('inputs');
  }
}
