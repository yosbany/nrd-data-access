import { ref, set, get, update, onValue, Unsubscribe } from 'firebase/database';
import { getFirebaseDatabase } from '../config/firebase';
import { CatalogConfig } from '../models';

/**
 * Servicio para el nodo único de configuración del catálogo (app cliente).
 * Gestiona productos en catálogo, categorías, opciones y parámetros de envío.
 */
export class CatalogConfigService {
  private readonly path = 'catalog';

  /**
   * Obtiene la configuración completa del catálogo.
   */
  async get(): Promise<CatalogConfig | null> {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, this.path));

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.val() as CatalogConfig;
  }

  /**
   * Establece o reemplaza toda la configuración del catálogo.
   */
  async set(config: CatalogConfig): Promise<void> {
    const db = getFirebaseDatabase();
    await set(ref(db, this.path), config);
  }

  /**
   * Actualiza parcialmente la configuración del catálogo.
   */
  async update(updates: Partial<CatalogConfig>): Promise<void> {
    const db = getFirebaseDatabase();
    await update(ref(db, this.path), updates);
  }

  /**
   * Escucha cambios en tiempo real en la configuración del catálogo.
   * Retorna una función para cancelar la suscripción.
   */
  onValue(callback: (config: CatalogConfig | null) => void): Unsubscribe {
    const db = getFirebaseDatabase();
    const unsubscribe = onValue(ref(db, this.path), (snapshot) => {
      const val = snapshot.exists() ? (snapshot.val() as CatalogConfig) : null;
      callback(val);
    });
    return unsubscribe;
  }

  /**
   * Obtiene la referencia de Firebase al nodo catalog (para usos avanzados).
   */
  getRef() {
    const db = getFirebaseDatabase();
    return ref(db, this.path);
  }
}
