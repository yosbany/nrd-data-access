import { ref, get, set, update } from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';

export interface ConfigItem {
  name: string;
  variableName: string;
  description: string;
  value: string;
}

function normalizeConfigItem(key: string, raw: unknown): ConfigItem {
  if (typeof raw === 'string') {
    return { name: key, variableName: key, description: '', value: raw };
  }
  if (raw && typeof raw === 'object' && 'value' in raw) {
    const o = raw as Record<string, unknown>;
    return {
      name: (o.name as string) || key,
      variableName: key,
      description: (o.description as string) || '',
      value: String(o.value ?? '')
    };
  }
  return { name: key, variableName: key, description: '', value: '' };
}

export class ConfigService {
  private readonly path = 'config';

  /**
   * Get a configuration value by key (backward compatible for nrd-costos, etc.)
   */
  async get(key: string): Promise<string | null> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `${this.path}/${key}`));
    if (!snapshot.exists()) return null;
    const val = snapshot.val();
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && 'value' in val) return String((val as any).value ?? '');
    return null;
  }

  /**
   * Set a configuration value (legacy, creates minimal object)
   */
  async set(key: string, value: string): Promise<void> {
    const existing = await this.getConfig(key);
    const data = {
      name: existing?.name ?? key,
      variableName: key,
      description: existing?.description ?? '',
      value
    };
    await this.setConfig(key, data);
  }

  /**
   * Get a full config item by variable name
   */
  async getConfig(variableName: string): Promise<ConfigItem | null> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `${this.path}/${variableName}`));
    if (!snapshot.exists()) return null;
    return normalizeConfigItem(variableName, snapshot.val());
  }

  /**
   * Get all configs with full details (name, variableName, description, value)
   */
  async getAllWithDetails(): Promise<Record<string, ConfigItem>> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, this.path));
    if (!snapshot.exists()) return {};
    const data = snapshot.val();
    const result: Record<string, ConfigItem> = {};
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        result[key] = normalizeConfigItem(key, data[key]);
      }
    }
    return result;
  }

  /**
   * Legacy: get all as key->value (for backward compatibility)
   */
  async getAll(): Promise<Record<string, string>> {
    const details = await this.getAllWithDetails();
    const result: Record<string, string> = {};
    for (const k in details) result[k] = details[k].value;
    return result;
  }

  /**
   * Save a full config item
   */
  async setConfig(variableName: string, item: ConfigItem): Promise<void> {
    const db = getFirebaseDatabase();
    await set(ref(db, `${this.path}/${variableName}`), {
      name: item.name || variableName,
      description: item.description || '',
      value: item.value || ''
    });
  }

  /**
   * Update multiple configuration values (partial update)
   */
  async update(updates: Record<string, string>): Promise<void> {
    const db = getFirebaseDatabase();
    const updateData: Record<string, unknown> = {};
    for (const key in updates) {
      const existing = await this.getConfig(key);
      updateData[`${this.path}/${key}`] = {
        name: existing?.name ?? key,
        variableName: key,
        description: existing?.description ?? '',
        value: updates[key]
      };
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
