import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { AboutSection } from './components/AboutSection';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { COMPANY_INFO } from './data/products';
import { useProductos } from './hooks/useProductos';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProductDetail } from './pages/ProductDetail';
import { NotFound } from './pages/NotFound';
import type { ProductCategory } from './types';
import {
  Flame,
  Award,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import './App.css';

const CURRENT_YEAR = new Date().getFullYear();

function SaltenasStore() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'todas' | ProductCategory>('todas');

  // Catálogo en tiempo real desde Dolibarr (precio y stock del ERP)
  const { productos, loading, error, recargar } = useProductos();

  // Al volver desde el detalle (ej. /#menu), baja hasta esa sección
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const seccion = document.getElementById(location.hash.slice(1));
      seccion?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const filteredProducts = productos.filter((product) => {
    if (selectedCategory === 'todas') return true;
    return product.category === selectedCategory;
  });

  const countSaltenas = productos.filter((p) => p.category === 'salteñas').length;
  const countBebidas = productos.filter((p) => p.category === 'bebidas').length;

  // Contenido de la página de inicio (hero, historia, catálogo, contacto)
  const homeContent = (
    <>
        {/* 2. Hero Banner Principal */}
        <section id="inicio" className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-white via-donjose-cream/20 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Texto y Llamados a la Acción */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-donjose-cream/80 border border-donjose-orange/30 px-4 py-2 rounded-full text-xs font-semibold text-donjose-brown shadow-sm">
                  <Flame className="w-4 h-4 text-donjose-orange fill-donjose-orange" />
                  <span>La Salteñería Emblemática de Cochabamba</span>
                </div>

                <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-donjose-brown tracking-tight leading-[1.1]">
                  Tradición y Jugosidad en{' '}
                  <span className="text-donjose-orange underline decoration-donjose-cream underline-offset-8">
                    Cada Salteña
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-donjose-brown/85 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Elaboramos cada mañana las salteñas más jugosas de Cochabamba, preservando la receta tradicional con carne selecta, verduras del valle y un repulgue dorado perfecto horneado al punto exacto.
                </p>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <a
                    href="/#menu"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-donjose-orange hover:bg-donjose-orange/90 text-white font-heading font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-donjose-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Ver Catálogo Oficial
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="/#historia"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-donjose-cream/40 text-donjose-brown font-heading font-semibold text-base px-7 py-4 rounded-2xl border border-donjose-cream shadow-sm hover:border-donjose-orange/50 transition-all"
                  >
                    Conoce Nuestra Misión
                  </a>
                </div>

                {/* Métricas / Reconocimientos */}
                <div className="pt-8 border-t border-donjose-cream/70 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <span className="block font-heading font-black text-2xl sm:text-3xl text-donjose-orange">
                      100%
                    </span>
                    <span className="text-xs text-donjose-brown/75 font-medium">
                      Ingredientes Locales
                    </span>
                  </div>
                  <div className="text-center lg:text-left border-x border-donjose-cream px-2">
                    <span className="block font-heading font-black text-2xl sm:text-3xl text-donjose-orange">
                      30 min
                    </span>
                    <span className="text-xs text-donjose-brown/75 font-medium">
                      Tandas de Horneado
                    </span>
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="block font-heading font-black text-2xl sm:text-3xl text-donjose-orange">
                      8.00 Bs
                    </span>
                    <span className="text-xs text-donjose-brown/75 font-medium">
                      Precio Accesible
                    </span>
                  </div>
                </div>
              </div>

              {/* Imagen del Hero con Tarjetas Flotantes */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-donjose-orange/20 to-donjose-cream rounded-3xl filter blur-2xl opacity-70 -z-10" />

                  <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-donjose-lg">
                    <img
                      src="/images/carne.jpg"
                      alt="Salteña tradicional cochabambina de Don José"
                      className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-donjose-brown/80 via-transparent to-transparent flex items-end p-6">
                      <div className="text-white">
                        <span className="inline-block bg-donjose-orange text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                          Receta Maestra
                        </span>
                        <h2 className="font-heading font-bold text-xl text-white">
                          Salteña de Carne Don José
                        </h2>
                        <p className="text-xs text-donjose-cream/90 font-light">
                          Relleno de jigote abundante, papa imilla y sazón del valle.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl border border-donjose-cream flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-donjose-cream flex items-center justify-center text-donjose-brown">
                      <Award className="w-6 h-6 text-donjose-orange" />
                    </div>
                    <div>
                      <span className="block text-xs uppercase text-donjose-brown/60 font-bold">
                        Garantía Don José
                      </span>
                      <span className="font-heading font-bold text-sm text-donjose-brown">
                        Caldo Hiperjugoso
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Componente Didáctico: Misión, Visión, Eslogan y Valores */}
        <AboutSection />

        {/* 4. Infografía Didáctica: La Anatomía de la Salteña Perfecta */}
        <section className="py-16 bg-white border-y border-donjose-cream/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-donjose-orange block mb-2">
                Guía Culinaria Didáctica
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-donjose-brown">
                El Arte y Anatomía de Nuestra Salteña
              </h2>
              <p className="text-sm text-donjose-brown/80 mt-2">
                ¿Por qué una salteña Don José es diferente? Cada detalle está pensado para maximizar el sabor y la jugosidad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-donjose-cream relative">
                <div className="w-10 h-10 rounded-xl bg-donjose-orange text-white flex items-center justify-center font-heading font-bold text-base mb-4">
                  01
                </div>
                <h3 className="font-heading font-bold text-lg text-donjose-brown mb-2">
                  La Masa Dulzona y Dorada
                </h3>
                <p className="text-xs sm:text-sm text-donjose-brown/75 leading-relaxed">
                  Amasada con manteca seleccionada y un sutil toque dulce que contrasta armónicamente con el calor del jigote salado y especiado.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-donjose-cream relative">
                <div className="w-10 h-10 rounded-xl bg-donjose-brown text-white flex items-center justify-center font-heading font-bold text-base mb-4">
                  02
                </div>
                <h3 className="font-heading font-bold text-lg text-donjose-brown mb-2">
                  Repulgue Superior Hermético
                </h3>
                <p className="text-xs sm:text-sm text-donjose-brown/75 leading-relaxed">
                  Trenzado a mano en la parte superior para sellar por completo el vapor y asegurar que ni una sola gota de caldo se escape durante el horneado.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-donjose-cream relative">
                <div className="w-10 h-10 rounded-xl bg-donjose-orange text-white flex items-center justify-center font-heading font-bold text-base mb-4">
                  03
                </div>
                <h3 className="font-heading font-bold text-lg text-donjose-brown mb-2">
                  Jigote Concentrado 12 Horas
                </h3>
                <p className="text-xs sm:text-sm text-donjose-brown/75 leading-relaxed">
                  Gelatina natural, caldos sustanciosos de hueso y carne, ají amarillo tostado y orégano silvestre que licúan al calor del horno.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Catálogo Oficial con Filtros Interactivos y ProductCards */}
        <section id="menu" className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Cabecera del Catálogo y Filtros */}
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
                  Selecciona tu tanda favorita. Recuerda que puedes pedir con diferentes niveles de picante o acompañar con nuestro mocochinchi artesanal.
                </p>
              </div>

              {/* Filtros Interactivos por Categoría ("Todas", "Salteñas", "Bebidas") */}
              <div className="inline-flex p-1.5 bg-donjose-cream/40 rounded-2xl border border-donjose-cream self-start md:self-auto shadow-sm">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('todas')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all duration-200 select-none ${
                    selectedCategory === 'todas'
                      ? 'bg-donjose-orange text-white shadow-md'
                      : 'text-donjose-brown/80 hover:text-donjose-brown hover:bg-donjose-cream/30'
                  }`}
                >
                  Todas ({productos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('salteñas')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all duration-200 select-none ${
                    selectedCategory === 'salteñas'
                      ? 'bg-donjose-orange text-white shadow-md'
                      : 'text-donjose-brown/80 hover:text-donjose-brown hover:bg-donjose-cream/30'
                  }`}
                >
                  Salteñas ({countSaltenas})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('bebidas')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all duration-200 select-none ${
                    selectedCategory === 'bebidas'
                      ? 'bg-donjose-orange text-white shadow-md'
                      : 'text-donjose-brown/80 hover:text-donjose-brown hover:bg-donjose-cream/30'
                  }`}
                >
                  Bebidas ({countBebidas})
                </button>
              </div>
            </div>

            {/* Grilla de Productos con ProductCard didácticos */}
            {/* Estado de conexión con Dolibarr */}
            {error && (
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4">
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>
                    <strong>No se pudo cargar el catálogo desde Dolibarr.</strong> {error}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={recargar}
                  className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-red-500 transition-colors self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reintentar
                </button>
              </div>
            )}

            {loading && productos.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-16 text-donjose-brown/70">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-semibold">Cargando productos desde Dolibarr...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. Sección de Ubicación, Horarios y Contacto Institucional */}
        <section id="contacto" className="py-20 bg-donjose-cream/25 border-t border-donjose-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-donjose-cream shadow-donjose-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-donjose-orange/15 text-donjose-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Atención al Público
                  </div>

                  <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-donjose-brown">
                    Visítanos en el Corazón de Cochabamba
                  </h2>

                  <p className="text-base text-donjose-brown/80 font-normal">
                    Comparte un momento inolvidable con la familia. También puedes hacer reservas para eventos o solicitar pedidos corporativos matutinos.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-donjose-cream/60 text-donjose-orange shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-heading font-bold text-sm text-donjose-brown block">
                          Dirección Central:
                        </span>
                        <span className="text-sm text-donjose-brown/80">
                          {COMPANY_INFO.address}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-donjose-cream/60 text-donjose-orange shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-heading font-bold text-sm text-donjose-brown block">
                          Horario de Atención Matutino:
                        </span>
                        <span className="text-sm text-donjose-brown/80">
                          {COMPANY_INFO.businessHours}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-donjose-cream/60 text-donjose-orange shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-heading font-bold text-sm text-donjose-brown block">
                          Teléfono Fijo y Pedidos:
                        </span>
                        <span className="text-sm text-donjose-brown/80">
                          {COMPANY_INFO.phone} • WhatsApp: {COMPANY_INFO.whatsapp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarjeta de Contacto Directo WhatsApp */}
                <div className="lg:col-span-5 bg-gradient-to-br from-donjose-brown to-[#4E1E17] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-donjose-orange flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xs uppercase text-donjose-cream/80 font-bold">
                          Canal Rápido
                        </span>
                        <h4 className="font-heading font-bold text-lg text-white">
                          Atención por WhatsApp
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-donjose-cream/85 leading-relaxed font-light">
                      ¿Tienes un evento especial o necesitas más de 20 salteñas? Escríbenos para reservar tu tanda caliente directamente del horno.
                    </p>

                    <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 text-xs text-donjose-cream flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-donjose-orange shrink-0" />
                      <span>Atención personalizada e inmediata</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/59171723456?text=${encodeURIComponent(
                      'Hola Salteñería Don José, quisiera consultar por disponibilidad de salteñas para hoy.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Abrir Chat de WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-donjose-brown font-sans selection:bg-donjose-orange selection:text-white">
      {/* 1. Barra de Navegación con Badge Reactivo Conectado al CartContext */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={homeContent} />
          <Route
            path="/producto/:ref"
            element={
              <ProductDetail productos={productos} loading={loading} error={error} onRetry={recargar} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 7. Footer Institucional */}
      <footer className="bg-donjose-brown text-donjose-cream py-12 border-t border-donjose-brown/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Identidad */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-white shadow flex items-center justify-center shrink-0">
                  <img
                    src="/images/Logo.png"
                    alt="Logo Salteñería Don José"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-heading font-black text-xl text-donjose-cream">
                  Salteñería <span className="text-donjose-orange">Don José</span>
                </span>
              </div>
              <p className="text-xs text-donjose-cream/75 max-w-sm leading-relaxed">
                "{COMPANY_INFO.slogan}"
              </p>
              <p className="text-xs text-donjose-cream/60">
                Preservando la gastronomía tradicional cochabambina con pasión, honestidad y el calor de nuestra gente.
              </p>
            </div>

            {/* Enlaces Rápidos */}
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-sm text-donjose-orange uppercase tracking-wider">
                Navegación
              </h4>
              <ul className="space-y-1.5 text-xs text-donjose-cream/80">
                <li><a href="/#inicio" className="hover:text-donjose-orange transition-colors">Inicio</a></li>
                <li><a href="/#menu" className="hover:text-donjose-orange transition-colors">Menú Oficial</a></li>
                <li><a href="/#historia" className="hover:text-donjose-orange transition-colors">Misión y Visión</a></li>
                <li><a href="/#contacto" className="hover:text-donjose-orange transition-colors">Sucursal y Contacto</a></li>
              </ul>
            </div>

            {/* Ubicación y NIT */}
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-sm text-donjose-orange uppercase tracking-wider">
                Cochabamba
              </h4>
              <p className="text-xs text-donjose-cream/80 leading-relaxed">
                Av. Heroínas esq. Ayacucho<br />
                Cochabamba, Bolivia<br />
                NIT: 1029384756
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-donjose-cream/20 flex flex-col sm:flex-row items-center justify-between text-xs text-donjose-cream/60 gap-4">
            <p>© {CURRENT_YEAR} Salteñería Don José. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1">
              Hecho con orgullo y tradición en el corazón de Bolivia
            </p>
          </div>
        </div>
      </footer>

      {/* 8. Panel Deslizante Lateral del Carrito de Compras */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 9. Modal Interactivo de Checkout, Pasarela Simple QR y Recibo */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={recargar}
      />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <SaltenasStore />
    </CartProvider>
  );
}

export default App;
