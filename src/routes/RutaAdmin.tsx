import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente envoltorio que protege las rutas del administrador.
 * Sin sesión → al login (y vuelve a la página pedida después de entrar).
 * Con sesión pero sin rol de administrador → aviso de acceso restringido.
 */
const RutaAdmin = ({ children }: { children: ReactNode }) => {
  const { isAutenticated, esAdmin, logout } = useAuth();
  const { pathname } = useLocation();

  if (!isAutenticated) {
    return <Navigate to="/login" replace state={{ volver: pathname }} />;
  }

  if (!esAdmin) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="bg-white rounded shadow p-8 max-w-md text-center space-y-4">
          <p className="font-bold text-donjose-brown">Esta sección es solo para administradores.</p>
          <div className="flex justify-center gap-3">
            <a href="/" className="px-4 py-2 border rounded text-sm">Volver a la tienda</a>
            <button type="button" onClick={logout} className="px-4 py-2 bg-orange-600 text-white rounded text-sm">
              Cerrar sesión
            </button>
          </div>
        </div>
      </main>
    );
  }

  return children;
};

export default RutaAdmin;
