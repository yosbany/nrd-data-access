import { BaseService } from './base.service';
import { ShiftMovement } from '../models';
export declare class ShiftMovementsService extends BaseService<ShiftMovement> {
    constructor();
    /**
     * Query movements by shift ID
     */
    queryByShift(shiftId: string): Promise<ShiftMovement[]>;
    /**
     * Query movements by shift ID and box
     */
    queryByShiftAndBox(shiftId: string, box: 'mostrador' | 'banca-juegos'): Promise<ShiftMovement[]>;
    /**
     * Listen to movements by shift ID
     */
    onValueByShift(shiftId: string, callback: (movements: ShiftMovement[]) => void): () => void;
}
//# sourceMappingURL=shift-movements.service.d.ts.map