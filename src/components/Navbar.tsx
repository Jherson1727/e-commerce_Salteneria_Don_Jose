import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Clock, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  cartCount?: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  const { totalItems } = useCart();
  const effectiveCount = cartCount !== undefined ? cartCount : totalItems;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '/#inicio' },
    { label: 'Menú Oficial', href: '/#menu' },
    { label: 'Tradición y Misión', href: '/#historia' },
    { label: 'Sucursal y Horarios', href: '/#contacto' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Barra superior de anuncios institucionales */}
      <div className="bg-donjose-brown text-donjose-cream text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-donjose-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-donjose-orange"></span>
            </span>
            <span className="font-medium tracking-wide">
              ¡Horneando en vivo en Cochabamba!
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-donjose-cream/90 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-donjose-orange" />
              07:30 - 13:00 (o hasta agotar stock)
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-donjose-orange" />
              Av. Heroínas esq. Ayacucho
            </span>
          </div>
        </div>
      </div>

      {/* Barra de navegación principal */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-donjose-cream/50'
            : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-donjose-cream/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logotipo e Identidad */}
            <a
              href="/#inicio"
              className="group flex items-center gap-3 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-donjose-orange/50 rounded-lg p-1"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white shadow-md shadow-donjose-orange/20 border border-donjose-cream flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <img
                  src="/images/Logo.png"
                  alt="Logo Salteñería Don José"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-donjose-brown leading-tight">
                  Salteñería <span className="text-donjose-orange">Don José</span>
                </span>
                <span className="text-[11px] font-medium text-donjose-brown/75 tracking-wider uppercase">
                  Cochabamba • Tradición & Calidad
                </span>
              </div>
            </a>

            {/* Enlaces de Navegación de Escritorio */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-medium text-sm text-donjose-brown/90 hover:text-donjose-orange transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-donjose-orange hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Acciones: Carrito y Menú Hamburguesa */}
            <div className="flex items-center gap-3">
              {/* Botón Disparador del Carrito con Badge Reactivo */}
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="Abrir carrito de compras"
                className="relative flex items-center gap-2.5 bg-donjose-orange hover:bg-donjose-orange/90 active:scale-95 text-white px-4 py-2.5 rounded-full font-medium text-sm shadow-md shadow-donjose-orange/25 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-donjose-orange focus:ring-offset-2"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                  {/* Badge contador reactivo */}
                  {effectiveCount > 0 ? (
                    <span className="absolute -top-2 -right-2.5 bg-donjose-brown text-donjose-cream font-heading font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow border-2 border-white animate-bounce">
                      {effectiveCount > 99 ? '99+' : effectiveCount}
                    </span>
                  ) : (
                    <span className="absolute -top-2 -right-2.5 bg-white/30 text-white font-heading text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      0
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-semibold">Mi Pedido</span>
              </button>

              {/* Botón Hamburguesa Móvil */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Alternar menú de navegación"
                className="md:hidden p-2 rounded-lg text-donjose-brown hover:bg-donjose-cream/50 transition-colors focus:outline-none focus:ring-2 focus:ring-donjose-orange"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-donjose-cream px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-donjose-brown hover:bg-donjose-cream/40 hover:text-donjose-orange transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-donjose-cream/60 flex flex-col gap-2 text-xs text-donjose-brown/80 px-3">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-donjose-orange" />
                Lunes a Domingo: 07:30 - 13:00
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-donjose-orange" />
                Av. Heroínas esq. Ayacucho, Cochabamba
              </span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
