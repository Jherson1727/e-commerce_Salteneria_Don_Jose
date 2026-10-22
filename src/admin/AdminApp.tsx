import { DOLIBARR_BASE_URL } from '../services/dolibarrClient';

/**
 * PANEL DE ADMINISTRACIÓN DE PRODUCTOS — SDJ-39 (Lenguajes de Programación)
 * Se abre en: http://localhost:5173/admin
 *
 * Tarea: adaptar aquí la página ProductosDolibarr del ejemplo del docente
 * (repo ProyectoIntegrador, rama formularioTolibarr):
 *   - pages/ProductosDolibarr.jsx            → src/admin/ProductosAdmin.jsx
 *   - componentes/dolibarr/ProductoFormModal → src/admin/ProductoFormModal.jsx
 *   - hooks/useProductosDolibarr.js          → src/admin/useProductosAdmin.js
 *   - services/productosDolibarrService.js   → src/admin/productosAdminService.js
 *
 * IMPORTANTE: usar `adminClient` (no tiendaClient) de '../services/dolibarrClient'.
 * adminClient usa la API key que el administrador ingresa en pantalla
 * (getAdminApiKey / setAdminApiKey), con un usuario que SÍ puede crear/editar productos.
 * Se pueden usar archivos .jsx (allowJs está activado).
 */
export const AdminApp = () => (
  <main className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6 text-donjose-brown">
    <div className="max-w-lg bg-white border border-donjose-cream rounded-3xl p-8 shadow-sm space-y-3">
      <h1 className="font-heading font-extrabold text-2xl">Panel de administración — Don José</h1>
      <p className="text-sm">
        En construcción (SDJ-39). Aquí irá el CRUD de productos conectado a Dolibarr.
      </p>
      <p className="text-xs text-donjose-brown/60 font-mono">API: {DOLIBARR_BASE_URL}</p>
      <a href="/" className="inline-block text-sm font-bold text-donjose-orange hover:underline">
        ← Volver a la tienda
      </a>
    </div>
  </main>
);

export default AdminApp;
