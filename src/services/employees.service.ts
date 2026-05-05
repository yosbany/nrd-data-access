import { BaseService } from './base.service';
import { Employee } from '../models';

export class EmployeesService extends BaseService<Employee> {
  constructor() {
    super('employees');
  }
}

