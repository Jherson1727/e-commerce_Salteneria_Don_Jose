import React, { useState } from 'react';
import { Flame, Star, Plus, Check, Filter } from 'lucide-react';
import type { Product, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<'todos' | ProductCategory>('todos');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedCategory === 'todos') return true;
    return product.category === selectedCategory;
  });

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1200);
  };

  const renderSpicyBadge = (level: number) => {
    if (level === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
          Sin Picante
        </span>
      );
    }
    if (level === 1) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
          Picante Medio
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
        <Flame className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
        Picante Fuego (Nivel 3)
      </span>
    );
  };

  return (
    <section id="menu" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Catálogo */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-donjose-orange mb-2">
              <Filter className="w-3.5 h-3.5" />
              Catálogo Oficial ERP
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-donjose-brown tracking-tight">
              Nuestras Especialidades Horneadas
            </h2>
            <p className="text-donjose-brown/75 text-base mt-2 max-w-xl">
              Salteñas con repulgue artesanal y masa dorada, acompañadas de bebidas y refrescos tradicionales cochabambinos.
            </p>
          </div>

          {/* Filtros de Categoría */}
          <div className="inline-flex p-1 bg-donjose-cream/30 rounded-2xl border border-donjose-cream/70 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('todos')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === 'todos'
                  ? 'bg-donjose-orange text-white shadow-sm'
                  : 'text-donjose-brown/80 hover:text-donjose-brown'
              }`}
            >
              Todos ({PRODUCTS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('salteñas')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === 'salteñas'
                  ? 'bg-donjose-orange text-white shadow-sm'
                  : 'text-donjose-brown/80 hover:text-donjose-brown'
              }`}
            >
              Salteñas
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('bebidas')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === 'bebidas'
                  ? 'bg-donjose-orange text-white shadow-sm'
                  : 'text-donjose-brown/80 hover:text-donjose-brown'
              }`}
            >
              Bebidas & Jugos
            </button>
          </div>
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isJustAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="group bg-[#FDFBF7] rounded-3xl overflow-hidden border border-donjose-cream/80 hover:border-donjose-orange/40 shadow-sm hover:shadow-donjose-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Imagen y Badges */}
                  <div className="relative h-56 overflow-hidden bg-donjose-cream/40">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                    {/* Badge Código ERP */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md font-mono text-[11px] font-bold text-donjose-brown px-2.5 py-1 rounded-lg shadow-sm border border-white/50">
                      {product.id}
                    </span>

                    {/* Badge Más Vendido */}
                    {product.isBestSeller && (
                      <span className="absolute top-3 right-3 bg-donjose-orange text-white text-[11px] font-heading font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        Favorito
                      </span>
                    )}

                    {/* Badge de Nivel de Picante */}
                    {product.category === 'salteñas' && (
                      <div className="absolute bottom-3 left-3">
                        {renderSpicyBadge(product.spicyLevel)}
                      </div>
                    )}
                  </div>

                  {/* Contenido descriptivo */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading font-bold text-xl text-donjose-brown group-hover:text-donjose-orange transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-donjose-brown/75 leading-relaxed line-clamp-3 mb-4">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Pie de Tarjeta: Precio y Botón */}
                <div className="p-6 pt-0 border-t border-donjose-cream/40 mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-donjose-brown/60 block">
                      Precio Oficial
                    </span>
                    <span className="font-heading font-extrabold text-2xl text-donjose-brown">
                      {product.price.toFixed(2)}{' '}
                      <span className="text-xs font-semibold text-donjose-orange">Bs</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(product)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-donjose-brown hover:bg-donjose-orange text-white hover:shadow-md'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        ¡Agregado!
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Pedir
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
