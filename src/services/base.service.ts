import { 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  push, 
  query, 
  orderByChild, 
  equalTo,
  onValue,
  off,
  DataSnapshot
} from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';
import { BaseEntity } from '../models';

export class BaseService<T extends BaseEntity> {
  protected path: string;

  constructor(path: string) {
    this.path = path;
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<T[]> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, this.path));
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })) as T[];
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<T | null> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `${this.path}/${id}`));
    
    if (!snapshot.exists()) {
      return null;
    }

    return {
      id,
      ...snapshot.val()
    } as T;
  }

  /**
   * Create a new entity
   */
  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const db = getFirebaseDatabase();
    const newRef = push(ref(db, this.path));
    
    const newEntity = {
      ...entity,
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as T;

    await set(newRef, newEntity);
    return newRef.key!;
  }

  /**
   * Update an existing entity
   */
  async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    const db = getFirebaseDatabase();
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: Date.now()
    };
    
    await update(ref(db, `${this.path}/${id}`), updatesWithTimestamp);
  }

  /**
   * Delete an entity
   */
  async delete(id: string): Promise<void> {
    const db = getFirebaseDatabase();
    await remove(ref(db, `${this.path}/${id}`));
  }

  /**
   * Query entities by child value
   */
  async queryByChild(childPath: string, value: any): Promise<T[]> {
    const db = getFirebaseDatabase();
    const q = query(ref(db, this.path), orderByChild(childPath), equalTo(value));
    const snapshot = await get(q);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })) as T[];
  }

  /**
   * Listen to real-time changes
   */
  onValue(callback: (data: T[]) => void): () => void {
    const db = getFirebaseDatabase();
    const dbRef = ref(db, this.path);
    
    onValue(dbRef, (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const data = snapshot.val();
      const entities = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) as T[];

      callback(entities);
    });

    return () => off(dbRef);
  }

  /**
   * Listen to real-time changes for a specific entity
   */
  onValueById(id: string, callback: (data: T | null) => void): () => void {
    const db = getFirebaseDatabase();
    const dbRef = ref(db, `${this.path}/${id}`);
    
    onValue(dbRef, (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id,
        ...snapshot.val()
      } as T);
    });

    return () => off(dbRef);
  }
}

