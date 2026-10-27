import { useState, useEffect, useCallback } from 'react';
import { productosAdminService } from './productosAdminService';
import { getErrorMessage } from '../services/dolibarrClient';

export const useProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  // Cargar lista de productos
  const cargarProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productosAdminService.listarProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`No se pudo cargar la lista de productos: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // Guardar (Crear o Editar)
  const guardarProducto = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      if (productoEditar) {
        await productosAdminService.actualizarProducto(productoEditar.id, formData);
      } else {
        await productosAdminService.crearProducto(formData);
      }
      await cargarProductos();
      cerrarModal();
    } catch (err) {
      setError(`No se pudo guardar el producto: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto con confirmación
  const eliminarProducto = async (id, ref) => {
    const confirmado = window.confirm(`¿Estás seguro de que deseas eliminar el producto "${ref}"?`);
    if (!confirmado) return;

    setLoading(true);
    setError(null);
    try {
      await productosAdminService.eliminarProducto(id);
      await cargarProductos();
    } catch (err) {
      setError(
        err?.response?.status === 409
          ? `No se puede eliminar "${ref}" porque ya tiene ventas, compras o stock registrados en Dolibarr. Para quitarlo de la tienda, edítalo y márcalo como "Fuera de venta".`
          : `No se pudo eliminar el producto: ${getErrorMessage(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Modales
  const abrirModalCrear = () => {
    setProductoEditar(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoEditar(producto);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setProductoEditar(null);
  };

  return {
    productos,
    loading,
    error,
    modalOpen,
    productoEditar,
    cargarProductos,
    guardarProducto,
    eliminarProducto,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal
  };
};