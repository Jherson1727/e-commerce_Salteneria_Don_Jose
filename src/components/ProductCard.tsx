import React, { useState } from 'react';
import { Flame, Star, Plus, Minus, Check, Info, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Formato oficial de precio en Bolivianos
  const formattedPrice = `Bs ${product.price.toFixed(2)}`;

  // Stock real del almacén de venta (ALM-POS) que viene de Dolibarr
  const stock = product.stock ?? 50;
  const maxQuantity = Math.min(stock, 50);
  const agotado = stock <= 0;

  // Consejos didácticos de consumo tradicional
  const traditionalTip =
    product.category === 'salteñas'
      ? 'Recomendado comer caliente con cuchara o en bolsa para disfrutar el jigote jugoso sin derramar ni una gota.'
      : 'Servir bien frío para acompañar y refrescar el paladar tras saborear el calor de la salteña.';

  const handleIncrement = () => {
    setLocalQuantity((prev) => Math.min(prev + 1, maxQuantity));
  };

  const handleDecrement = () => {
    setLocalQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (agotado) return;
    addToCart(product, Math.min(localQuantity, maxQuantity));
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  // Renderizador de badge de nivel de picante
  const renderSpicyIndicator = () => {
    if (product.category !== 'salteñas') {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-0.5 rounded-full">
          Bebida Refrescante
        </span>
      );
    }

    switch (product.spicyLevel) {
      case 0:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Sin Picante (Dulce)
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-sm">
            <Flame className="w-3.5 h-3.5 text-donjose-orange fill-donjose-orange" />
            Picante Medio (Tradicional)
          </span>
        );
      case 2:
      case 3:
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-900 bg-red-50 border border-red-300 px-2.5 py-0.5 rounded-full shadow-sm">
            <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" />
            <Flame className="w-3 h-3 text-red-600 fill-red-600" />
            Picante Fuego (Nivel {product.spicyLevel})
          </span>
        );
    }
  };

  return (
    <article className="group bg-[#FDFBF7] rounded-3xl overflow-hidden border border-donjose-cream shadow-sm hover:shadow-donjose-lg hover:border-donjose-orange/40 transition-all duration-300 flex flex-col justify-between relative">
      <div>
        {/* Contenedor de Imagen con Superposiciones */}
        <div className="relative h-60 w-full overflow-hidden bg-donjose-cream/40">
          <Link to={`/producto/${product.id}`} aria-label={`Ver detalles de ${product.name}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-donjose-brown/60 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

          {/* Código ERP del producto */}
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-donjose-brown font-mono font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-sm border border-donjose-cream">
            {product.id}
          </span>

          {/* Badge Más Vendido */}
          {product.isBestSeller && (
            <span className="absolute top-3 right-3 bg-donjose-orange text-white text-[11px] font-heading font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              Favorito
            </span>
          )}

          {/* Indicador de Nivel de Picante */}
          <div className="absolute bottom-3 left-3 z-10">
            {renderSpicyIndicator()}
          </div>
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-6 pb-2">
          {/* Título y Precio */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-heading font-extrabold text-xl text-donjose-brown group-hover:text-donjose-orange transition-colors">
              <Link to={`/producto/${product.id}`} className="hover:underline">
                {product.name}
              </Link>
            </h3>
            <span className="font-heading font-black text-xl text-donjose-orange shrink-0">
              {formattedPrice}
            </span>
          </div>

          {/* Descripción con ingrediente y tradición */}
          <p className="text-xs sm:text-sm text-donjose-brown/80 leading-relaxed line-clamp-3 mb-3 font-normal">
            {product.description}
          </p>

          <Link
            to={`/producto/${product.id}`}
            className="inline-block text-xs font-bold text-donjose-orange hover:underline mb-2"
          >
            Ver detalles →
          </Link>

          {/* Disponibilidad en tiempo real (Dolibarr · ALM-POS) */}
          {product.stock !== undefined && (
            <p
              className={`text-[11px] font-bold mb-4 ${
                agotado ? 'text-red-600' : stock <= 10 ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {agotado ? 'Agotado por hoy' : `Disponibles: ${stock} unidades`}
            </p>
          )}

          {/* Alerta / Badge didáctico de Consumo Tradicional */}
          <div className="relative mb-4">
            <div
              className="flex items-start gap-2 bg-donjose-cream/40 border border-donjose-cream p-2.5 rounded-xl cursor-pointer hover:bg-donjose-cream/60 transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              role="button"
              tabIndex={0}
              aria-label="Consejo de consumo tradicional"
            >
              <Info className="w-4 h-4 text-donjose-orange shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] font-heading font-bold text-donjose-brown uppercase tracking-wider block">
                  Consumo Tradicional
                </span>
                <p className="text-[11px] text-donjose-brown/80 leading-snug line-clamp-2">
                  {traditionalTip}
                </p>
              </div>
            </div>

            {/* Tooltip flotante interactivo expandido */}
            {showTooltip && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-donjose-brown text-donjose-cream text-xs rounded-xl shadow-xl z-20 animate-fadeIn border border-donjose-orange/40">
                <p className="font-medium leading-relaxed">
                  💡 <strong>Tradición Cochabambina:</strong> {traditionalTip}
                </p>
                <div className="w-3 h-3 bg-donjose-brown rotate-45 absolute -bottom-1.5 left-6" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controles de Compra Rápida e Incremento */}
      <div className="p-6 pt-3 border-t border-donjose-cream/60 bg-donjose-cream/15 mt-auto">
        <div className="flex items-center gap-3">
          {/* Selector de Cantidad */}
          <div className="flex items-center bg-white border border-donjose-cream rounded-2xl shadow-sm p-1">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={localQuantity <= 1}
              aria-label="Disminuir cantidad"
              className="w-7 h-7 rounded-xl flex items-center justify-center text-donjose-brown hover:bg-donjose-cream/60 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-heading font-bold text-xs sm:text-sm text-donjose-brown w-7 text-center select-none">
              {localQuantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={agotado || localQuantity >= maxQuantity}
              aria-label="Aumentar cantidad"
              className="w-7 h-7 rounded-xl flex items-center justify-center text-donjose-brown hover:bg-donjose-cream/60 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botón de Acción Directa con Microanimación */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={agotado}
            className={`flex-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-heading font-bold text-xs sm:text-sm shadow-md transition-all duration-300 active:scale-95 select-none ${
              isAdded
                ? 'bg-emerald-600 text-white scale-[1.02] shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-donjose-orange hover:bg-donjose-orange/90 text-white shadow-donjose-orange/25 hover:shadow-lg'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3] animate-bounce" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{agotado ? 'Agotado' : 'Añadir al Pedido'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
