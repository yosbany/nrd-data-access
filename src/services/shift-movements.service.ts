import { BaseService } from './base.service';
import { ShiftMovement } from '../models';
import { 
  query, 
  orderByChild, 
  equalTo,
  get,
  ref,
  onValue,
  off,
  DataSnapshot
} from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';

export class ShiftMovementsService extends BaseService<ShiftMovement> {
  constructor() {
    super('shiftMovements');
  }

  /**
   * Query movements by shift ID
   */
  async queryByShift(shiftId: string): Promise<ShiftMovement[]> {
    const db = getFirebaseDatabase();
    const movementsRef = ref(db, this.path);
    const q = query(movementsRef, orderByChild('shiftId'), equalTo(shiftId));
    const snapshot = await get(q);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })) as ShiftMovement[];
  }

  /**
   * Query movements by shift ID and box
   */
  async queryByShiftAndBox(shiftId: string, box: 'mostrador' | 'banca-juegos'): Promise<ShiftMovement[]> {
    const movements = await this.queryByShift(shiftId);
    return movements.filter(m => m.box === box);
  }

  /**
   * Listen to movements by shift ID
   */
  onValueByShift(shiftId: string, callback: (movements: ShiftMovement[]) => void): () => void {
    const db = getFirebaseDatabase();
    const movementsRef = ref(db, this.path);
    const q = query(movementsRef, orderByChild('shiftId'), equalTo(shiftId));
    
    const handler = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const data = snapshot.val();
      const items = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) as ShiftMovement[];
      
      callback(items);
    };

    onValue(q, handler, (error) => {
      console.error('Error listening to movements:', error);
      callback([]);
    });

    return () => {
      off(q, 'value', handler);
    };
  }
}
