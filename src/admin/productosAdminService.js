import { adminClient } from '../services/dolibarrClient';

export const productosAdminService = {
  async listarProductos() {
    const response = await adminClient.get('/products');
    return response.data;
  },
  async crearProducto(productoData) {
    const response = await adminClient.post('/products', productoData);
    return response.data;
  },
  async actualizarProducto(id, productoData) {
    const response = await adminClient.put(`/products/${id}`, productoData);
    return response.data;
  },
  async eliminarProducto(id) {
    const response = await adminClient.delete(`/products/${id}`);
    return response.data;
  }
};