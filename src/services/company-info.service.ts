import { ref, set, get, update } from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';
import { CompanyInfo } from '../models';

export class CompanyInfoService {
  private readonly path = 'companyInfo';

  /**
   * Get company info
   */
  async get(): Promise<CompanyInfo | null> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, this.path));
    
    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.val() as CompanyInfo;
  }

  /**
   * Set company info (creates or replaces)
   */
  async set(companyInfo: CompanyInfo): Promise<void> {
    const db = getFirebaseDatabase();
    await set(ref(db, this.path), companyInfo);
  }

  /**
   * Update company info (partial update)
   */
  async update(updates: Partial<CompanyInfo>): Promise<void> {
    const db = getFirebaseDatabase();
    await update(ref(db, this.path), updates);
  }
}
