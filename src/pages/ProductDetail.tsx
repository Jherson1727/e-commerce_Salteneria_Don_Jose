import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Flame,
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Star,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailProps {
  productos: Product[];
  loading: boolean;
  error: string;
  onRetry: () => void;
}

const bs = (v: number) => `Bs ${v.toFixed(2)}`;

const spicyLabel = (p: Product) => {
  if (p.category !== 'salteñas') return 'Bebida refrescante';
  return ['Sin picante (dulce)', 'Picante medio (tradicional)', 'Picante', 'Picante fuego'][
    p.spicyLevel
  ];
};

/**
 * Página de detalle de un producto: /producto/:ref (ej. /producto/SAL-01).
 * Usa los datos en tiempo real de Dolibarr (precio, impuesto y stock de ALM-POS).
 */
export const ProductDetail: React.FC<ProductDetailProps> = ({
  productos,
  loading,
  error,
  onRetry,
}) => {
  const { ref } = useParams();
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const producto = productos.find((p) => p.id === ref);

  // Al entrar a la página, se muestra desde arriba y se reinicia la cantidad
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCantidad(1);
  }, [ref]);

  if (loading && !producto) {
    return (
      <div className="flex items-center justify-center gap-2 py-32 text-donjose-brown/70">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-semibold">Cargando producto desde Dolibarr...</span>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        {error ? (
          <>
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-sm text-red-800">
              <strong>No se pudo cargar el producto desde Dolibarr.</strong> {error}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-red-500"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar
            </button>
          </>
        ) : (
          <>
            <Package className="w-10 h-10 text-donjose-orange mx-auto" />
            <h1 className="font-heading font-extrabold text-2xl text-donjose-brown">
              Producto no encontrado
            </h1>
            <p className="text-sm text-donjose-brown/70">
              El producto <strong>{ref}</strong> no existe o ya no está a la venta.
            </p>
          </>
        )}
        <Link to="/#menu" className="inline-block text-sm font-bold text-donjose-orange hover:underline">
          ← Volver al menú
        </Link>
      </div>
    );
  }

  const stock = producto.stock ?? 50;
  const agotado = stock <= 0;
  const maxCantidad = Math.min(stock, 50);
  const precioSinImpuesto = producto.priceHT ?? producto.price;
  const impuesto = producto.price - precioSinImpuesto;
  const relacionados = productos.filter((p) => p.id !== producto.id).slice(0, 3);

  const handleAgregar = () => {
    if (agotado) return;
    addToCart(producto, Math.min(cantidad, maxCantidad));
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1400);
  };

  return (
    <div className="bg-[#FDFBF7]">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Migas de pan */}
        <nav className="text-xs text-donjose-brown/70 mb-6 flex items-center gap-2" aria-label="Ruta">
          <Link to="/" className="hover:text-donjose-orange">Inicio</Link>
          <span>/</span>
          <Link to="/#menu" className="hover:text-donjose-orange">Menú</Link>
          <span>/</span>
          <span className="font-semibold text-donjose-brown">{producto.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Imagen */}
          <div className="relative rounded-3xl overflow-hidden border border-donjose-cream shadow-donjose-lg bg-donjose-cream/40">
            <img
              src={producto.image}
              alt={producto.name}
              className="w-full h-80 sm:h-[28rem] object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/95 text-donjose-brown font-mono font-bold text-xs px-3 py-1 rounded-lg shadow-sm border border-donjose-cream">
              {producto.id}
            </span>
            {producto.isBestSeller && (
              <span className="absolute top-4 right-4 bg-donjose-orange text-white text-xs font-heading font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-white" />
                Favorito
              </span>
            )}
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-donjose-orange mb-2">
                {producto.category === 'salteñas' && <Flame className="w-3.5 h-3.5" />}
                {spicyLabel(producto)}
              </span>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-donjose-brown tracking-tight">
                {producto.name}
              </h1>
              <p className="font-heading font-black text-3xl text-donjose-orange mt-3">
                {bs(producto.price)}
                <span className="text-sm font-sans font-semibold text-donjose-brown/60 ml-2">
                  por unidad
                </span>
              </p>
            </div>

            <p className="text-donjose-brown/85 leading-relaxed">{producto.description}</p>

            {/* Ficha del producto (datos en tiempo real de Dolibarr) */}
            <dl className="bg-white border border-donjose-cream rounded-2xl divide-y divide-donjose-cream text-sm">
              <div className="flex justify-between px-4 py-3">
                <dt className="text-donjose-brown/70">Precio</dt>
                <dd className="font-semibold">{bs(precioSinImpuesto)}</dd>
              </div>
              <div className="flex justify-between px-4 py-3">
                <dt className="text-donjose-brown/70">+ Impuestos</dt>
                <dd className="font-semibold">{bs(impuesto)}</dd>
              </div>
              <div className="flex justify-between px-4 py-3">
                <dt className="text-donjose-brown/70">Stock</dt>
                <dd
                  className={`font-bold ${
                    agotado ? 'text-red-600' : stock <= 10 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {agotado ? 'Agotado por hoy' : `${stock} unidades`}
                </dd>
              </div>
            </dl>

            {/* Cantidad y agregar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-donjose-cream rounded-2xl shadow-sm p-1">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(c - 1, 1))}
                  disabled={cantidad <= 1}
                  aria-label="Disminuir cantidad"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-donjose-cream/60 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-heading font-bold w-9 text-center">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(c + 1, maxCantidad))}
                  disabled={agotado || cantidad >= maxCantidad}
                  aria-label="Aumentar cantidad"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-donjose-cream/60 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAgregar}
                disabled={agotado}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-heading font-bold text-sm shadow-md transition-all active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed ${
                  agregado
                    ? 'bg-emerald-600 text-white'
                    : 'bg-donjose-orange hover:bg-donjose-orange/90 text-white'
                }`}
              >
                {agregado ? (
                  <>
                    <Check className="w-4 h-4" /> ¡Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {agotado ? 'Agotado' : `Añadir al pedido · ${bs(producto.price * cantidad)}`}
                  </>
                )}
              </button>
            </div>

            <Link
              to="/#menu"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-donjose-brown/80 hover:text-donjose-orange"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al menú
            </Link>
          </div>
        </div>
      </section>

      {/* Otros productos */}
      {relacionados.length > 0 && (
        <section className="bg-white border-t border-donjose-cream py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-extrabold text-2xl text-donjose-brown mb-8">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relacionados.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
