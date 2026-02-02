import { BaseService } from './base.service';
import { Product } from '../models';
/**
 * Producto expandido: cuando withVariants=true, cada variante se devuelve como item con todos los campos.
 * Incluye productId (padre) y variantId para identificar la variante.
 */
export interface ProductExpanded extends Product {
    productId: string;
    variantId?: string;
    productName?: string;
}
/**
 * Options for filtering products in getAll
 */
export interface ProductsGetOptions {
    /**
     * - true: Solo productos con variantes. Cada variante se devuelve como un item independiente
     *         (producto completo con campos del padre + variante). El padre no se incluye.
     * - false: Solo productos sin variantes (padre como único producto).
     * - undefined: Sin filtro, todos los productos.
     */
    withVariants?: boolean;
}
export declare class ProductsService extends BaseService<Product> {
    constructor();
    /**
     * Get all products, optionally filtered/expanded by variants.
     * - withVariants: true → Un item por variante (cada variante es un producto completo).
     * - withVariants: false → Solo padres sin variantes.
     */
    getAll(options?: ProductsGetOptions): Promise<(Product | ProductExpanded)[]>;
}
//# sourceMappingURL=products.service.d.ts.map