import { Link } from 'react-router-dom';

/** Página para rutas que no existen. */
export const NotFound = () => (
  <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-3">
    <p className="font-heading font-black text-6xl text-donjose-orange">404</p>
    <h1 className="font-heading font-extrabold text-2xl text-donjose-brown">Página no encontrada</h1>
    <p className="text-sm text-donjose-brown/70">La página que buscas no existe.</p>
    <Link to="/" className="inline-block text-sm font-bold text-donjose-orange hover:underline">
      ← Volver al inicio
    </Link>
  </div>
);

export default NotFound;
