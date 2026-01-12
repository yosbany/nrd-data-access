import { BaseService } from './base.service';
import { ShiftIncident } from '../models';
export declare class ShiftIncidentsService extends BaseService<ShiftIncident> {
    constructor();
    /**
     * Query incidents by shift ID
     */
    queryByShift(shiftId: string): Promise<ShiftIncident[]>;
    /**
     * Listen to incidents by shift ID
     */
    onValueByShift(shiftId: string, callback: (incidents: ShiftIncident[]) => void): () => void;
}
//# sourceMappingURL=shift-incidents.service.d.ts.map