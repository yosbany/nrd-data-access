import { BaseService } from './base.service';
import { Product } from '../models';
/**
 * Producto expandido: cuando se pide variantes o flat, cada variante se devuelve como ítem con todos los campos.
 * Se identifica por SKU único: el producto padre tiene sku = product.sku || product.id; las variantes tienen sku distinto (variant.sku o productId_variantId).
 */
export interface ProductExpanded extends Product {
    productId: string;
    variantId?: string;
    /** SKU único: en padre = product.sku || product.id; en variante = variant.sku o productId_variantId. */
    sku?: string;
    productName?: string;
}
/**
 * Opciones de getAll:
 * - Sin opciones (o productsOnly: true): solo productos. Un ítem por producto padre (id único); si tiene variantes no se expanden.
 * - variantsOnly: true: solo variantes. Un ítem por cada variante (cada uno con SKU distinto). No se incluyen los padres como filas.
 * - flat: true: productos y variantes. Un ítem por producto padre + un ítem por cada variante (todos en la misma lista).
 */
export interface ProductsGetOptions {
    /** Si true, devuelve solo ítems que son variantes (cada variante con su SKU). Equivalente a withVariants: true. */
    variantsOnly?: boolean;
    /**
     * - true: Solo variantes (un ítem por variante, sin filas de padre).
     * - false: Solo productos sin variantes.
     * - undefined: según otras opciones.
     */
    withVariants?: boolean;
    /** Si true, devuelve productos y variantes: un ítem por padre + un ítem por cada variante. */
    flat?: boolean;
    /** Si true, devuelve solo productos padre (uno por producto). Es el comportamiento por defecto. */
    productsOnly?: boolean;
}
export declare class ProductsService extends BaseService<Product> {
    constructor();
    /**
     * Get all products según el modo pedido:
     * - Sin opciones (o productsOnly: true): solo productos. Un ítem por producto (id); variantes no se expanden.
     * - flat: true: productos y variantes. Un ítem por padre + un ítem por cada variante (cada variante con SKU distinto).
     * - variantsOnly: true o withVariants: true: solo variantes. Un ítem por cada variante (solo variantes, sin filas de padre).
     */
    getAll(options?: ProductsGetOptions): Promise<(Product | ProductExpanded)[]>;
    /** Solo variantes: un ítem por variante, cada uno con SKU único. No se incluyen padres como filas. */
    private getVariantsOnly;
    /**
     * Productos y variantes: un ítem por producto padre (sku = product.sku || product.id) + un ítem por cada variante (sku distinto).
     * Nombre de variante = compuesto: "Nombre padre - Nombre variante".
     */
    private getAllFlat;
}
//# sourceMappingURL=products.service.d.ts.map