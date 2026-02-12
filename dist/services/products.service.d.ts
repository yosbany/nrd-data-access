import { BaseService } from './base.service';
import { Product } from '../models';
/**
 * Producto expandido: cuando withVariants=true, cada variante se devuelve como item con todos los campos.
 * Se identifica por SKU único: producto y variantes se enlazan por SKU (el id es el mismo para producto y variantes).
 */
export interface ProductExpanded extends Product {
    productId: string;
    variantId?: string;
    /** SKU único de la variante (variant.sku o productId_variantId si no hay sku). Enlace por SKU. */
    sku?: string;
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
    /**
     * - true: Una sola lista con todos los ítems: cada producto padre como una línea,
     *         cada variante como otra línea. Productos sin variantes aparecen como una línea.
     * - undefined/false: Comportamiento según withVariants.
     */
    flat?: boolean;
}
export declare class ProductsService extends BaseService<Product> {
    constructor();
    /**
     * Get all products, optionally filtered/expanded by variants.
     * - withVariants: true → Un item por variante (cada variante es un producto completo).
     * - withVariants: false → Solo padres sin variantes.
     * - flat: true → Una lista: padres (cada uno una línea) y variantes (cada una una línea).
     */
    getAll(options?: ProductsGetOptions): Promise<(Product | ProductExpanded)[]>;
    /**
     * Lista plana: producto padre como una línea, cada variante como otra línea; productos sin variantes como una línea.
     */
    private getAllFlat;
}
//# sourceMappingURL=products.service.d.ts.map