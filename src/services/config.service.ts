import { ref, get, set, update } from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';

export class ConfigService {
  private readonly path = 'config';

  /**
   * Get a configuration value by key
   */
  async get(key: string): Promise<string | null> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `${this.path}/${key}`));
    
    if (!snapshot.exists()) {
      return null;
    }

    const value = snapshot.val();
    return typeof value === 'string' ? value : null;
  }

  /**
   * Set a configuration value (creates or replaces)
   */
  async set(key: string, value: string): Promise<void> {
    const db = getFirebaseDatabase();
    await set(ref(db, `${this.path}/${key}`), value);
  }

  /**
   * Get all configuration values
   */
  async getAll(): Promise<Record<string, string>> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, this.path));
    
    if (!snapshot.exists()) {
      return {};
    }

    const data = snapshot.val();
    // Filter to only return string values
    const result: Record<string, string> = {};
    for (const key in data) {
      if (typeof data[key] === 'string') {
        result[key] = data[key];
      }
    }
    return result;
  }

  /**
   * Update multiple configuration values (partial update)
   */
  async update(updates: Record<string, string>): Promise<void> {
    const db = getFirebaseDatabase();
    const updateData: Record<string, string> = {};
    
    for (const key in updates) {
      updateData[`${this.path}/${key}`] = updates[key];
    }
    
    await update(ref(db, '/'), updateData);
  }

  /**
   * Delete a configuration key
   */
  async delete(key: string): Promise<void> {
    const db = getFirebaseDatabase();
    await set(ref(db, `${this.path}/${key}`), null);
  }
}
