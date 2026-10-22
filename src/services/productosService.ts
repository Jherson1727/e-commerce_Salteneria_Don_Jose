import { tiendaClient } from './dolibarrClient';
import { PRODUCTS } from '../data/products';
import type { Product, ProductCategory } from '../types';

/** Producto tal como lo devuelve GET /products de Dolibarr (solo los campos que usamos). */
interface DolibarrProduct {
  id: string;
  ref: string;
  label: string;
  description?: string | null;
  price?: string | number | null;
  price_ttc?: string | number | null;
  tva_tx?: string | number | null;
  stock_reel?: string | number | null;
  stock_warehouse?: Record<string, { real?: string | number | null }> | null;
}

interface DolibarrWarehouse {
  id: string;
  ref?: string;
  label?: string;
}

export const ALMACEN_VENTA_REF: string = import.meta.env.VITE_DOLIBARR_ALMACEN || 'ALM-POS';

const toNumber = (v: unknown, def = 0): number => {
  const n = parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : def;
};

let almacenIdCache: number | null = null;

/** Busca el id del almacén de venta (ALM-POS) en Dolibarr. */
export const getAlmacenVentaId = async (): Promise<number> => {
  if (almacenIdCache) return almacenIdCache;
  const { data } = await tiendaClient.get<DolibarrWarehouse[]>('/warehouses', {
    params: { sqlfilters: `(t.ref:=:'${ALMACEN_VENTA_REF}')`, limit: 1 },
  });
  const almacen = Array.isArray(data) ? data[0] : undefined;
  if (!almacen) throw new Error(`No se encontró el almacén ${ALMACEN_VENTA_REF} en Dolibarr`);
  almacenIdCache = Number(almacen.id);
  return almacenIdCache;
};

/**
 * Une los datos reales del ERP (precio, stock, id) con los datos de
 * presentación que ya tenía el e-commerce (foto, descripción, picante),
 * usando la referencia del producto (SAL-01, BEB-01...) como enlace.
 */
const toProduct = (p: DolibarrProduct, almacenId: number): Product => {
  const local = PRODUCTS.find((lp) => lp.id === p.ref);
  const category: ProductCategory =
    local?.category ?? (p.ref.startsWith('BEB') ? 'bebidas' : 'salteñas');
  const stockAlmacen = p.stock_warehouse?.[String(almacenId)]?.real;

  return {
    id: p.ref,
    name: p.label || local?.name || p.ref,
    description: local?.description || p.description || '',
    price: toNumber(p.price_ttc, local?.price ?? 0),
    category,
    image: local?.image || '/images/Logo.png',
    spicyLevel: local?.spicyLevel ?? 0,
    isBestSeller: local?.isBestSeller ?? false,
    dolibarrId: Number(p.id),
    stock: Math.max(0, Math.floor(toNumber(stockAlmacen ?? 0))),
    priceHT: toNumber(p.price),
    tvaTx: toNumber(p.tva_tx),
  };
};

export const ProductosService = {
  /**
   * Lista los productos que están "en venta" en Dolibarr, con su stock
   * en el almacén de venta. Solo SAL-xx y BEB-xx (los insumos no están en venta).
   */
  getProductos: async (signal?: AbortSignal): Promise<Product[]> => {
    const almacenId = await getAlmacenVentaId();
    try {
      const { data } = await tiendaClient.get<DolibarrProduct[]>('/products', {
        params: {
          sortfield: 't.ref',
          sortorder: 'ASC',
          limit: 100,
          mode: 1, // solo productos (no servicios)
          includestockdata: 1,
          sqlfilters: '(t.tosell:=:1)',
        },
        signal,
      });
      return (Array.isArray(data) ? data : []).map((p) => toProduct(p, almacenId));
    } catch (error) {
      // Dolibarr responde 404 cuando no hay resultados
      if ((error as { response?: { status?: number } })?.response?.status === 404) return [];
      throw error;
    }
  },
};

export default ProductosService;
