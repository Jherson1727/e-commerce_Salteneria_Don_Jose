import React, { useState, useEffect } from 'react';

export const ProductoFormModal = ({ isOpen, onClose, onSave, producto, loading }) => {
  const [formData, setFormData] = useState({
    ref: '',
    label: '',
    price: '',
    status: '1',
    description: ''
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        ref: producto.ref || '',
        label: producto.label || '',
        price: producto.price || '',
        status: producto.status !== undefined ? String(producto.status) : '1',
        description: producto.description || ''
      });
    } else {
      setFormData({
        ref: '',
        label: '',
        price: '',
        status: '1',
        description: ''
      });
    }
  }, [producto, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price) || 0,
      status: parseInt(formData.status, 10)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-orange-600 px-6 py-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 font-bold text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referencia (Código)</label>
            <input
              type="text"
              name="ref"
              required
              disabled={!!producto}
              value={formData.ref}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
              placeholder="Ej: SAL-05"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Etiqueta</label>
            <input
              type="text"
              name="label"
              required
              value={formData.label}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: Salteña Especial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs)</label>
            <input
              type="number"
              step="0.5"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: 8.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="1">En venta</option>
              <option value="0">Fuera de venta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Descripción breve del producto..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};