import React from 'react';
import { useProductosAdmin } from './useProductosAdmin';
import { ProductoFormModal } from './ProductoFormModal';

export const ProductosAdmin = () => {
  const {
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
  } = useProductosAdmin();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Productos (Dolibarr)</h1>
          <p className="text-sm text-gray-600">Salteñería Don José</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={cargarProductos}
            disabled={loading}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            🔄 Recargar
          </button>
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-orange-600 text-white font-medium rounded hover:bg-orange-700"
          >
            + Nuevo Producto
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && !productos.length ? (
        <div className="text-center py-12 bg-white rounded shadow">
          <p className="text-gray-500">Cargando productos de Dolibarr...</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-sm">
                <th className="p-4">Ref</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Precio (Bs)</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {productos.map((prod) => (
                <tr key={prod.id || prod.ref} className="hover:bg-gray-50">
                  <td className="p-4 font-mono font-bold">{prod.ref}</td>
                  <td className="p-4 font-medium">{prod.label}</td>
                  <td className="p-4">{parseFloat(prod.price || 0).toFixed(2)} Bs</td>
                  <td className="p-4">{prod.stock_reel ?? 'N/D'} unidades</td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => abrirModalEditar(prod)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(prod.id, prod.ref)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded border border-red-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductoFormModal
        isOpen={modalOpen}
        onClose={cerrarModal}
        onSave={guardarProducto}
        producto={productoEditar}
        loading={loading}
      />
    </div>
  );
};