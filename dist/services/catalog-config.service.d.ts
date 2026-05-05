import { Unsubscribe } from 'firebase/database';
import { CatalogConfig } from '../models';
/**
 * Servicio para el nodo único de configuración del catálogo (app cliente).
 * Gestiona productos en catálogo, categorías, opciones y parámetros de envío.
 */
export declare class CatalogConfigService {
    private readonly path;
    /**
     * Obtiene la configuración completa del catálogo.
     */
    get(): Promise<CatalogConfig | null>;
    /**
     * Establece o reemplaza toda la configuración del catálogo.
     */
    set(config: CatalogConfig): Promise<void>;
    /**
     * Actualiza parcialmente la configuración del catálogo.
     */
    update(updates: Partial<CatalogConfig>): Promise<void>;
    /**
     * Escucha cambios en tiempo real en la configuración del catálogo.
     * Retorna una función para cancelar la suscripción.
     */
    onValue(callback: (config: CatalogConfig | null) => void): Unsubscribe;
    /**
     * Obtiene la referencia de Firebase al nodo catalog (para usos avanzados).
     */
    getRef(): import("@firebase/database").DatabaseReference;
}
//# sourceMappingURL=catalog-config.service.d.ts.map