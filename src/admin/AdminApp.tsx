import { ProductosAdmin } from './ProductosAdmin';
import { setAdminApiKey } from '../services/dolibarrClient';

export const AdminApp = () => (
  <main className="min-h-screen bg-[#FDFBF7] p-6 text-donjose-brown">
    <div className="max-w-7xl mx-auto mb-4 flex justify-between items-center">
      <a href="/" className="text-sm font-bold text-donjose-orange hover:underline">
        ← Volver a la tienda
      </a>
      
      {/* Input agregado para proteger el panel con la API Key del admin */}
      <div className="bg-white p-2 rounded shadow-sm border border-gray-200 flex items-center gap-2">
        <input 
          type="password" 
          placeholder="API Key de Dolibarr" 
          onChange={(e) => setAdminApiKey(e.target.value)}
          className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <span className="text-xs text-gray-500 font-medium">Panel Protegido</span>
      </div>
    </div>

    <ProductosAdmin />
  </main>
);

export default AdminApp;