import { useCallback, useEffect, useState } from 'react';
import ProductosService from '../services/productosService';
import { getErrorMessage } from '../services/dolibarrClient';
import type { Product } from '../types';

/**
 * Hook que trae el catálogo desde Dolibarr (mismo patrón que useProductosDolibarr del docente).
 * Devuelve el estado de carga, el error y una función para recargar
 * (se usa después de cada venta para mostrar el stock actualizado).
 */
export const useProductos = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<{ key: number | null; data: Product[]; error: string }>({
    key: null,
    data: [],
    error: '',
  });

  const recargar = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    ProductosService.getProductos(controller.signal)
      .then((data) => setResult({ key: reloadKey, data, error: '' }))
      .catch((err) => {
        if (!controller.signal.aborted) {
          setResult((prev) => ({ key: reloadKey, data: prev.data, error: getErrorMessage(err) }));
        }
      });
    return () => controller.abort();
  }, [reloadKey]);

  return {
    productos: result.data,
    loading: result.key !== reloadKey,
    error: result.error,
    recargar,
  };
};

export default useProductos;
