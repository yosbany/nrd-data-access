import { BaseService } from './base.service';
import { Product, ProductVariant } from '../models';

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

function getVariantsArray(product: Product): (ProductVariant & { id?: string })[] {
  const v = product.variants;
  if (!v) return [];
  if (Array.isArray(v)) {
    return v.map((item, idx) => {
      const base = typeof item === 'object' && item !== null ? item : {};
      const id = (base as any)?.id ?? (base as any)?.sku ?? String(idx + 1);
      return { ...base, id } as ProductVariant & { id?: string };
    });
  }
  if (typeof v === 'object' && v !== null) {
    const entries = Object.entries(v);
    const numeric = entries.length > 0 && entries.every(([k]) => /^\d+$/.test(k));
    const sorted = numeric
      ? [...entries].sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
      : entries;
    return sorted.map(([key, item]) => {
      const base = typeof item === 'object' && item !== null ? item : {};
      const id = (base as any)?.id ?? (base as any)?.sku ?? key;
      return { ...base, id } as ProductVariant & { id?: string };
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
   * Get all products según el modo pedido:
   * - Sin opciones (o productsOnly: true): solo productos. Un ítem por producto (id); variantes no se expanden.
   * - flat: true: productos y variantes. Un ítem por padre + un ítem por cada variante (cada variante con SKU distinto).
   * - variantsOnly: true o withVariants: true: solo variantes. Un ítem por cada variante (solo variantes, sin filas de padre).
   */
  async getAll(options?: ProductsGetOptions): Promise<(Product | ProductExpanded)[]> {
    const all = await super.getAll();

    if (options?.flat === true) {
      return this.getAllFlat(all);
    }

    if (options?.variantsOnly === true || options?.withVariants === true) {
      return this.getVariantsOnly(all);
    }

    if (options?.withVariants === false) {
      return all.filter((p) => !hasVariants(p));
    }

    return all;
  }

  /** Solo variantes: un ítem por variante, cada uno con SKU único. No se incluyen padres como filas. */
  private getVariantsOnly(all: Product[]): ProductExpanded[] {
    const result: ProductExpanded[] = [];
    for (const product of all) {
      const variants = getVariantsArray(product);
      for (const variant of variants) {
        const variantId = (variant as any).id ?? (variant as any).sku ?? '';
        const variantSku = (variant as any).sku ?? (product.id! + '_' + variantId);
        const variantName = (variant as any).name ?? '';
        const compositeName = (product.name && variantName)
          ? product.name + ' - ' + variantName
          : (variantName || product.name || '');
        result.push({
          ...product,
          ...(variant as object),
          id: product.id!,
          productId: product.id!,
          variantId,
          sku: variantSku,
          productName: product.name,
          name: compositeName,
          price: variant.price ?? product.price,
          attributes: { ...(product.attributes || {}), ...(variant.attributes || {}) },
          variants: undefined
        } as ProductExpanded);
      }
    }
    return result;
  }

  /**
   * Productos y variantes: un ítem por producto padre (sku = product.sku || product.id) + un ítem por cada variante (sku distinto).
   * Nombre de variante = compuesto: "Nombre padre - Nombre variante".
   */
  private async getAllFlat(all: Product[]): Promise<(Product | ProductExpanded)[]> {
    const result: (Product | ProductExpanded)[] = [];
    for (const product of all) {
      const variants = getVariantsArray(product);
      const parentSku = (product as any).sku ?? product.id ?? '';

      if (variants.length === 0) {
        result.push({ ...product, sku: parentSku });
        continue;
      }

      result.push({
        ...product,
        productId: product.id!,
        sku: parentSku,
        productName: product.name,
        variants: undefined
      } as ProductExpanded);

      for (const variant of variants) {
        const variantId = (variant as any).id ?? (variant as any).sku ?? '';
        const variantSku = (variant as any).sku ?? (product.id! + '_' + variantId);
        const variantName = (variant as any).name ?? '';
        const compositeName = (product.name && variantName)
          ? product.name + ' - ' + variantName
          : (variantName || product.name || '');
        result.push({
          ...product,
          ...(variant as object),
          id: product.id!,
          productId: product.id!,
          variantId,
          sku: variantSku,
          productName: product.name,
          name: compositeName,
          price: variant.price ?? product.price,
          attributes: { ...(product.attributes || {}), ...(variant.attributes || {}) },
          variants: undefined
        } as ProductExpanded);
      }
    }
    return result;
  }
}

