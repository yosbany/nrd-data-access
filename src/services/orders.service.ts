import { BaseService } from './base.service';
import { Order } from '../models';

export class OrdersService extends BaseService<Order> {
  constructor() {
    super('orders');
  }
}

