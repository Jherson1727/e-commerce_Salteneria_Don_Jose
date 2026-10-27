import { useState } from 'react';
import { ProductosAdmin } from './ProductosAdmin';
import { getAdminApiKey, setAdminApiKey } from '../services/dolibarrClient';

/**
 * Panel de administración de productos (SDJ-39).
 * El administrador escribe su API key de Dolibarr; se guarda en el navegador
 * y la usa adminClient. Sin una clave válida, Dolibarr rechaza las peticiones.
 */
export const AdminApp = () => {
  const [clave, setClave] = useState('');
  const [hayClave, setHayClave] = useState(() => Boolean(getAdminApiKey()));
  // Cambia cada vez que se guarda o borra la clave, para volver a cargar la lista
  const [version, setVersion] = useState(0);

  const guardarClave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clave.trim()) return;
    setAdminApiKey(clave);
    setClave('');
    setHayClave(true);
    setVersion((v) => v + 1);
  };

  const borrarClave = () => {
    setAdminApiKey('');
    setHayClave(false);
    setVersion((v) => v + 1);
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-6 text-donjose-brown">
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-3 justify-between items-center">
        <a href="/" className="text-sm font-bold text-donjose-orange hover:underline">
          ← Volver a la tienda
        </a>

        {/* Acceso protegido con la API key del administrador */}
        <form
          onSubmit={guardarClave}
          className="bg-white p-2 rounded shadow-sm border border-gray-200 flex items-center gap-2"
        >
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder={hayClave ? 'Clave guardada (escribe otra para cambiarla)' : 'API Key del administrador'}
            aria-label="API Key del administrador de Dolibarr"
            className="w-72 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 font-medium"
          >
            Entrar
          </button>
          {hayClave && (
            <button
              type="button"
              onClick={borrarClave}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Salir
            </button>
          )}
        </form>
      </div>

      {hayClave ? (
        <ProductosAdmin key={version} />
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded shadow p-8 text-center text-sm text-gray-600">
          Escribe la API Key del administrador de Dolibarr para ver y gestionar los productos.
        </div>
      )}
    </main>
  );
};

export default AdminApp;
