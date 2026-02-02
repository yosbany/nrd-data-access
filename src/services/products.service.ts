import { BaseService } from './base.service';
import { Product, ProductVariant } from '../models';

/**
 * Producto expandido: cuando withVariants=true, cada variante se devuelve como item con todos los campos.
 * Incluye productId (padre) y variantId para identificar la variante.
 */
export interface ProductExpanded extends Product {
  productId: string;
  variantId?: string;
  productName?: string; // Nombre del padre (para display "Padre - Variante")
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

function getVariantsArray(product: Product): ProductVariant[] {
  const v = product.variants;
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'object' && v !== null) {
    return Object.entries(v).map(([key, item]) => {
      const base = typeof item === 'object' && item !== null ? item : {};
      return { ...base, id: (base as any)?.id || key } as unknown as ProductVariant;
    });
  }
  return [];
}

function hasVariants(product: Product): boolean {
  return getVariantsArray(product).length > 0;
}

export class ProductsService extends BaseService<Product> {
  constructor() {
    super('products');
  }

  /**
   * Get all products, optionally filtered/expanded by variants.
   * - withVariants: true → Un item por variante (cada variante es un producto completo).
   * - withVariants: false → Solo padres sin variantes.
   */
  async getAll(options?: ProductsGetOptions): Promise<(Product | ProductExpanded)[]> {
    const all = await super.getAll();

    if (!options || options.withVariants === undefined) {
      return all;
    }

    if (options.withVariants === true) {
      // Un item por variante: cada variante como producto completo (padre + variante mergeado)
      const result: ProductExpanded[] = [];
      for (const product of all) {
        const variants = getVariantsArray(product);
        if (variants.length === 0) continue;

        for (const variant of variants) {
          const variantId = (variant as any).id || (variant as any).sku || '';
          // Padre primero, luego variante sobrescribe todas sus propiedades
          const merged: ProductExpanded = {
            ...product,
            ...(variant as object),
            id: product.id!,
            productId: product.id!,
            variantId,
            productName: product.name,
            name: variant.name ?? product.name,
            price: variant.price ?? product.price,
            attributes: { ...(product.attributes || {}), ...(variant.attributes || {}) },
            variants: undefined
          };
          result.push(merged);
        }
      }
      return result;
    }

    // withVariants: false → Solo productos sin variantes
    return all.filter((p) => !hasVariants(p));
  }
}

