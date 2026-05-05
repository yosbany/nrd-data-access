import { BaseService } from './base.service';
import { Shift } from '../models';
export declare class ShiftsService extends BaseService<Shift> {
    constructor();
    /**
     * Query shifts by date
     */
    queryByDate(date: string): Promise<Shift[]>;
    /**
     * Get active shift (not closed) by date and shift type
     */
    getActiveShift(date: string, shift: 'mañana' | 'tarde'): Promise<Shift | null>;
    /**
     * Query shift by date and shift type
     */
    queryByDateAndShift(date: string, shift: 'mañana' | 'tarde'): Promise<Shift | null>;
}
//# sourceMappingURL=shifts.service.d.ts.map