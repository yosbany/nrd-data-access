import { BaseService } from './base.service';
import { Task } from '../models';

export class TasksService extends BaseService<Task> {
  constructor() {
    super('tasks');
  }
}

