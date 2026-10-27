import { adminClient } from '../services/dolibarrClient';

/**
 * Convierte los datos del formulario al formato de Dolibarr.
 * El precio que escribe el administrador es el precio final (IVA incluido),
 * igual al que ve el cliente en la tienda, por eso se envía como price_ttc
 * con price_base_type 'TTC'. Si se enviara solo "price", Dolibarr ignoraría
 * el cambio en los productos que tienen base TTC (las salteñas).
 */
const aDolibarr = ({ price, tva_tx, ...resto }) => ({
  ...resto,
  price_ttc: price,
  price_base_type: 'TTC',
  tva_tx,
});

export const productosAdminService = {
  // Solo productos de la tienda: se excluyen los insumos de cocina (INS-xx)
  async listarProductos() {
    const response = await adminClient.get('/products', {
      params: { sqlfilters: "(t.ref:notlike:'INS-%')", limit: 100 },
    });
    return response.data;
  },
  async crearProducto(productoData) {
    const response = await adminClient.post('/products', { ...aDolibarr(productoData), type: 0 });
    return response.data;
  },
  async actualizarProducto(id, productoData) {
    const { ref: _ref, ...datos } = productoData; // la referencia no se modifica
    const response = await adminClient.put(`/products/${id}`, aDolibarr(datos));
    return response.data;
  },
  async eliminarProducto(id) {
    const response = await adminClient.delete(`/products/${id}`);
    return response.data;
  },
};
