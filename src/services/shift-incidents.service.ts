import { BaseService } from './base.service';
import { ShiftIncident } from '../models';
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

export class ShiftIncidentsService extends BaseService<ShiftIncident> {
  constructor() {
    super('shiftIncidents');
  }

  /**
   * Query incidents by shift ID
   */
  async queryByShift(shiftId: string): Promise<ShiftIncident[]> {
    const db = getFirebaseDatabase();
    const incidentsRef = ref(db, this.path);
    const q = query(incidentsRef, orderByChild('shiftId'), equalTo(shiftId));
    const snapshot = await get(q);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })) as ShiftIncident[];
  }

  /**
   * Listen to incidents by shift ID
   */
  onValueByShift(shiftId: string, callback: (incidents: ShiftIncident[]) => void): () => void {
    const db = getFirebaseDatabase();
    const incidentsRef = ref(db, this.path);
    const q = query(incidentsRef, orderByChild('shiftId'), equalTo(shiftId));
    
    const handler = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const data = snapshot.val();
      const items = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) as ShiftIncident[];
      
      callback(items);
    };

    onValue(q, handler, (error) => {
      console.error('Error listening to incidents:', error);
      callback([]);
    });

    return () => {
      off(q, 'value', handler);
    };
  }
}
