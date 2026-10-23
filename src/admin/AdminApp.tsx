import { ProductosAdmin } from './ProductosAdmin';

export const AdminApp = () => (
  <main className="min-h-screen bg-[#FDFBF7] p-6 text-donjose-brown">
    <div className="max-w-7xl mx-auto mb-4 flex justify-between items-center">
      <a href="/" className="text-sm font-bold text-donjose-orange hover:underline">
        ← Volver a la tienda
      </a>
    </div>
    <ProductosAdmin />
  </main>
);

export default AdminApp;