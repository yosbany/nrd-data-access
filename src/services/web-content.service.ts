import { ref, set, get, update, onValue, Unsubscribe } from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';
import { WebContent } from '../models';

/**
 * Servicio para el nodo único /web (contenido editable de nrd-web).
 */
export class WebContentService {
  private readonly path = 'web';

  async get(): Promise<WebContent | null> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, this.path));
    if (!snapshot.exists()) return null;
    return snapshot.val() as WebContent;
  }

  async set(content: WebContent): Promise<void> {
    const db = getFirebaseDatabase();
    await set(ref(db, this.path), content);
  }

  async update(updates: Partial<WebContent>): Promise<void> {
    const db = getFirebaseDatabase();
    await update(ref(db, this.path), updates);
  }

  onValue(callback: (content: WebContent | null) => void): Unsubscribe {
    const db = getFirebaseDatabase();
    return onValue(ref(db, this.path), (snapshot) => {
      const val = snapshot.exists() ? (snapshot.val() as WebContent) : null;
      callback(val);
    });
  }

  getRef() {
    const db = getFirebaseDatabase();
    return ref(db, this.path);
  }
}
