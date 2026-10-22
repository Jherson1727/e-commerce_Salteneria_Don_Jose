import { tiendaClient } from './dolibarrClient';
import { ProductosService, getAlmacenVentaId } from './productosService';
import type { CartItem, Product } from '../types';

export const CLIENTE_WEB_NOMBRE: string =
  import.meta.env.VITE_DOLIBARR_CLIENTE_WEB || 'Cliente Web';

/** Cuenta bancaria donde entran los cobros QR y modo de pago (transferencia). */
export const CUENTA_COBRO_REF: string = import.meta.env.VITE_DOLIBARR_CUENTA || 'BANCO-QR';
export const MODO_PAGO_CODIGO: string = import.meta.env.VITE_DOLIBARR_MODO_PAGO || 'VIR';

interface DolibarrThirdparty {
  id: string;
  name?: string;
}

interface DolibarrInvoice {
  id: string;
  ref: string;
}

export interface DatosCliente {
  nombre: string;
  celular: string;
  nit: string;
}

export interface VentaRegistrada {
  facturaId: number;
  facturaRef: string;
  /** true si el cobro quedó registrado en Dolibarr (factura "Pagada") */
  pagoRegistrado: boolean;
}

interface DolibarrBankAccount {
  id: string;
  ref: string;
}

interface DolibarrPaymentType {
  id: string;
  code: string;
}

let cuentaIdCache: number | null = null;
let modoPagoIdCache: number | null = null;

/** Id de la cuenta bancaria de cobros QR (BANCO-QR) en Dolibarr. */
const getCuentaCobroId = async (): Promise<number> => {
  if (cuentaIdCache) return cuentaIdCache;
  const { data } = await tiendaClient.get<DolibarrBankAccount[]>('/bankaccounts', {
    params: { sqlfilters: `(t.ref:=:'${CUENTA_COBRO_REF}')`, limit: 1 },
  });
  const cuenta = Array.isArray(data) ? data[0] : undefined;
  if (!cuenta) throw new Error(`No se encontró la cuenta ${CUENTA_COBRO_REF} en Dolibarr`);
  cuentaIdCache = Number(cuenta.id);
  return cuentaIdCache;
};

/** Id del modo de pago (VIR = transferencia, el QR es una transferencia bancaria). */
const getModoPagoId = async (): Promise<number> => {
  if (modoPagoIdCache) return modoPagoIdCache;
  const { data } = await tiendaClient.get<DolibarrPaymentType[]>('/setup/dictionary/payment_types');
  const modo = (Array.isArray(data) ? data : []).find((m) => m.code === MODO_PAGO_CODIGO);
  if (!modo) throw new Error(`No existe el modo de pago ${MODO_PAGO_CODIGO} en Dolibarr`);
  modoPagoIdCache = Number(modo.id);
  return modoPagoIdCache;
};

/**
 * Registra el cobro de la factura en la cuenta BANCO-QR.
 * La factura pasa a "Pagada" y el dinero aparece en Bancos | Cajas.
 */
const registrarPago = async (facturaId: number, ordenWeb: string): Promise<void> => {
  const [accountid, paymentid] = await Promise.all([getCuentaCobroId(), getModoPagoId()]);
  await tiendaClient.post(`/invoices/${facturaId}/payments`, {
    datepaye: Math.floor(Date.now() / 1000),
    paymentid,
    closepaidinvoices: 'yes',
    accountid,
    num_payment: ordenWeb,
    comment: `Pago Simple QR del pedido web ${ordenWeb}`,
  });
};

let clienteWebIdCache: number | null = null;

/** Busca el id del tercero "Cliente Web" en Dolibarr (todas las ventas en línea van a su nombre). */
export const getClienteWebId = async (): Promise<number> => {
  if (clienteWebIdCache) return clienteWebIdCache;
  const nombre = CLIENTE_WEB_NOMBRE.replace(/'/g, "\\'");
  const { data } = await tiendaClient.get<DolibarrThirdparty[]>('/thirdparties', {
    params: { sqlfilters: `(t.nom:=:'${nombre}')`, limit: 1 },
  });
  const cliente = Array.isArray(data) ? data[0] : undefined;
  if (!cliente) throw new Error(`No se encontró el tercero "${CLIENTE_WEB_NOMBRE}" en Dolibarr`);
  clienteWebIdCache = Number(cliente.id);
  return clienteWebIdCache;
};

const escapeSql = (v: string) => v.replace(/'/g, "\\'");

/**
 * Busca al cliente en Dolibarr por su celular (y NIT si lo dio).
 * Si no existe, lo crea como tercero "Cliente" con nombre, celular y NIT.
 * Así cada venta web queda a nombre del cliente real (CRM) y no de "Cliente Web".
 * Si algo falla, se usa "Cliente Web" como respaldo para no perder la venta.
 */
export const getOrCreateCliente = async (cliente: DatosCliente): Promise<number> => {
  const celular = cliente.celular.trim();
  const nit = cliente.nit.trim();
  try {
    const filtros = [`(t.phone:=:'${escapeSql(celular)}')`];
    // El NIT (idprof1) se guarda en la columna 'siren' de Dolibarr
    if (nit && nit !== '0') filtros.push(`(t.siren:=:'${escapeSql(nit)}')`);
    const { data } = await tiendaClient.get<DolibarrThirdparty[]>('/thirdparties', {
      params: { sqlfilters: filtros.join(' or '), limit: 1 },
    });
    const existente = Array.isArray(data) ? data[0] : undefined;
    if (existente) return Number(existente.id);
  } catch (error) {
    // Dolibarr responde 404 cuando no encuentra resultados: se crea el cliente
    if ((error as { response?: { status?: number } })?.response?.status !== 404) throw error;
  }

  try {
    const { data: nuevoId } = await tiendaClient.post<number>('/thirdparties', {
      name: cliente.nombre.trim(),
      client: 1, // 1 = cliente
      code_client: '-1', // Dolibarr asigna el código automáticamente
      phone: celular,
      idprof1: nit && nit !== '0' ? nit : '',
      note_private: 'Cliente registrado desde el e-commerce',
    });
    return Number(nuevoId);
  } catch {
    return getClienteWebId();
  }
};

/**
 * Revisa en Dolibarr, justo antes de vender, que haya stock suficiente.
 * Devuelve los datos actuales del ERP de cada producto (id, precio, impuesto).
 */
const verificarStock = async (items: CartItem[]): Promise<Map<string, Product>> => {
  const productos = await ProductosService.getProductos();
  const actuales = new Map<string, Product>();
  for (const item of items) {
    const actual = productos.find((p) => p.id === item.id);
    if (!actual?.dolibarrId) {
      throw new Error(`El producto ${item.id} no está disponible en Dolibarr`);
    }
    if ((actual.stock ?? 0) < item.quantity) {
      throw new Error(
        `Stock insuficiente de ${actual.name}: quedan ${actual.stock ?? 0} y pediste ${item.quantity}`
      );
    }
    actuales.set(item.id, actual);
  }
  return actuales;
};

export const VentasService = {
  /**
   * Registra una venta del e-commerce en Dolibarr:
   *  1. Verifica el stock en ALM-POS.
   *  2. Busca o crea al cliente y crea la factura (borrador) a su nombre.
   *  3. La valida indicando el almacén ALM-POS → Dolibarr descuenta el stock.
   *  4. Registra el cobro QR en la cuenta BANCO-QR → la factura queda "Pagada".
   */
  registrarVenta: async (
    items: CartItem[],
    cliente: DatosCliente,
    ordenWeb: string
  ): Promise<VentaRegistrada> => {
    if (items.length === 0) throw new Error('El carrito está vacío');

    const actuales = await verificarStock(items);
    const [socid, idwarehouse] = await Promise.all([
      getOrCreateCliente(cliente),
      getAlmacenVentaId(),
    ]);

    // 2. Crear la factura en borrador
    const { data: facturaId } = await tiendaClient.post<number>('/invoices', {
      socid,
      type: 0, // factura estándar
      date: Math.floor(Date.now() / 1000),
      ref_client: ordenWeb,
      note_public: `Pedido web ${ordenWeb} · Cliente: ${cliente.nombre} · Cel: ${cliente.celular} · NIT/CI: ${cliente.nit || '0'}`,
      lines: items.map((item) => {
        const producto = actuales.get(item.id)!;
        return {
          fk_product: producto.dolibarrId,
          qty: item.quantity,
          subprice: producto.priceHT ?? producto.price,
          tva_tx: producto.tvaTx ?? 0,
          product_type: 0,
        };
      }),
    });

    // 3. Validar en el almacén de venta (aquí baja el stock)
    const { data: factura } = await tiendaClient.post<DolibarrInvoice>(
      `/invoices/${facturaId}/validate`,
      { idwarehouse, notrigger: 0 }
    );

    // 4. Registrar el cobro (si falla, la venta igual queda registrada como "a cobrar")
    let pagoRegistrado = true;
    try {
      await registrarPago(Number(facturaId), ordenWeb);
    } catch (error) {
      pagoRegistrado = false;
      console.warn('La venta se registró, pero no el cobro en Dolibarr:', error);
    }

    return {
      facturaId: Number(facturaId),
      facturaRef: factura?.ref || String(facturaId),
      pagoRegistrado,
    };
  },
};

export default VentasService;
