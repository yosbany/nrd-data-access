import { BaseService } from './base.service';
import { PurchaseOrder } from '../models';

export class PurchaseOrdersService extends BaseService<PurchaseOrder> {
  constructor() {
    super('purchaseOrders');
  }
}
