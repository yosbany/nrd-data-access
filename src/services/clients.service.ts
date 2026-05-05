import { BaseService } from './base.service';
import { Client } from '../models';

export class ClientsService extends BaseService<Client> {
  constructor() {
    super('clients');
  }
}

