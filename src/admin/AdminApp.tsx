import { ProductosAdmin } from './ProductosAdmin';
import { useAuth } from '../context/AuthContext';

/**
 * Panel de administración de productos (SDJ-39).
 * Solo se muestra dentro de RutaAdmin, es decir, con la sesión de un administrador.
 * Las peticiones usan el token de esa sesión (adminClient).
 */
export const AdminApp = () => {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-6 text-donjose-brown">
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-3 justify-between items-center">
        <a href="/" className="text-sm font-bold text-donjose-orange hover:underline">
          ← Volver a la tienda
        </a>

        <div className="bg-white p-2 rounded shadow-sm border border-gray-200 flex items-center gap-3">
          <span className="text-sm">
            Sesión: <b>{user?.nombre}</b> (administrador)
          </span>
          <button type="button" onClick={logout} className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            Cerrar sesión
          </button>
        </div>
      </div>

      <ProductosAdmin />
    </main>
  );
};

export default AdminApp;
