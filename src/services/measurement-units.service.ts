import { BaseService } from './base.service';
import { MeasurementUnit } from '../models';

export class MeasurementUnitsService extends BaseService<MeasurementUnit> {
  constructor() {
    super('measurementUnits');
  }
}
