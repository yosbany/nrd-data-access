import { BaseService } from './base.service';
import { StockCount } from '../models';
/**
 * Registros de conteo físico en /stockCounts
 */
export declare class StockCountsService extends BaseService<StockCount> {
    constructor();
    /**
     * Conteos de un producto, filtrados por misma variante (SKU) o producto padre si variantSku vacío.
     * Orden descendente por createdAt (más reciente primero).
     */
    listByProductAndVariant(productId: string, variantSku?: string | null): Promise<StockCount[]>;
}
//# sourceMappingURL=stock-counts.service.d.ts.map