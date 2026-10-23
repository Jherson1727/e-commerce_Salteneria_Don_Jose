import { useState, useEffect, useCallback } from 'react';
import { productosAdminService } from './productosAdminService';

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
      setError('Error al cargar la lista de productos desde Dolibarr.');
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
      setError('Error al guardar el producto. Verifica los datos o la API Key.');
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
      setError('Error al eliminar el producto de Dolibarr.');
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