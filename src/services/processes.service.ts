import { BaseService } from './base.service';
import { Process } from '../models';

export class ProcessesService extends BaseService<Process> {
  constructor() {
    super('processes');
  }
}

