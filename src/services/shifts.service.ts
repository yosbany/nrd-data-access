import { BaseService } from './base.service';
import { Shift } from '../models';
import { 
  query, 
  orderByChild, 
  equalTo,
  get,
  ref
} from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';

export class ShiftsService extends BaseService<Shift> {
  constructor() {
    super('shifts');
  }

  /**
   * Query shifts by date
   */
  async queryByDate(date: string): Promise<Shift[]> {
    const db = getFirebaseDatabase();
    const shiftsRef = ref(db, this.path);
    const q = query(shiftsRef, orderByChild('date'), equalTo(date));
    const snapshot = await get(q);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })) as Shift[];
  }

  /**
   * Get active shift (not closed) by date and shift type
   */
  async getActiveShift(date: string, shift: 'mañana' | 'tarde'): Promise<Shift | null> {
    const shifts = await this.queryByDate(date);
    return shifts.find(s => s.shift === shift && !s.closed) || null;
  }

  /**
   * Query shift by date and shift type
   */
  async queryByDateAndShift(date: string, shift: 'mañana' | 'tarde'): Promise<Shift | null> {
    const shifts = await this.queryByDate(date);
    return shifts.find(s => s.shift === shift) || null;
  }
}
