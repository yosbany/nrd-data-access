import { BaseService } from './base.service';
import { Aguinaldo } from '../models';

export class AguinaldoService extends BaseService<Aguinaldo> {
  constructor() {
    super('aguinaldo');
  }
}
