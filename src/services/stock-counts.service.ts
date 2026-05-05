import { BaseService } from './base.service';
import { StockCount } from '../models';

/**
 * Registros de conteo físico en /stockCounts
 */
export class StockCountsService extends BaseService<StockCount> {
  constructor() {
    super('stockCounts');
  }

  /**
   * Conteos de un producto, filtrados por misma variante (SKU) o producto padre si variantSku vacío.
   * Orden descendente por createdAt (más reciente primero).
   */
  async listByProductAndVariant(
    productId: string,
    variantSku?: string | null
  ): Promise<StockCount[]> {
    const rows = await this.queryByChild('productId', productId);
    const key = variantSku == null || variantSku === '' ? '' : String(variantSku);
    const filtered = rows.filter((r) => {
      const rv = r.variantSku == null || r.variantSku === '' ? '' : String(r.variantSku);
      return rv === key;
    });
    filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return filtered;
  }
}
