import React, { useEffect, useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Receipt,
  QrCode,
  Banknote,
  CreditCard,
  User,
  Phone,
  FileText,
  Flame,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

type DrawerStep = 'cart' | 'checkout' | 'success';
type PaymentMethod = 'qr' | 'efectivo' | 'tarjeta';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();

  const [currentStep, setCurrentStep] = useState<DrawerStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [nit, setNit] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Manejo de accesibilidad: tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Si se vacía el carrito, derivamos el paso a 'cart'
  const effectiveStep = cart.length === 0 && currentStep === 'checkout' ? 'cart' : currentStep;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const generatedOrder: Order = {
      id: `DJ-${Date.now().toString().slice(-6)}`,
      customerName: customerName.trim() || 'Cliente Mostrador',
      phone: phone.trim() || 'Sin número registrado',
      nit: nit.trim() || '0',
      items: [...cart],
      total: totalPrice,
      date: new Date().toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }),
      status: 'pendiente',
    };

    setCompletedOrder(generatedOrder);
    setCurrentStep('success');
    clearCart();
  };

  const handleCloseAndReset = () => {
    setCurrentStep('cart');
    setCompletedOrder(null);
    setCustomerName('');
    setPhone('');
    setNit('');
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}
      aria-modal="true"
      role="dialog"
      aria-label="Cajón lateral del carrito de compras"
    >
      {/* Backdrop con desenfoque suave */}
      <div
        className={`fixed inset-0 bg-donjose-brown/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleCloseAndReset}
      />

      {/* Panel deslizante accesible */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside
          className={`w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-l border-donjose-cream ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Cabecera del Drawer */}
          <div className="p-5 sm:p-6 bg-donjose-brown text-donjose-cream flex items-center justify-between border-b border-donjose-brown/80 shadow-md">
            <div className="flex items-center gap-3">
              {effectiveStep === 'checkout' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('cart')}
                  className="p-1.5 -ml-1 text-donjose-cream/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Volver al carrito"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-10 h-10 rounded-xl bg-donjose-orange flex items-center justify-center text-white shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-black text-lg text-donjose-cream leading-tight">
                  {effectiveStep === 'cart' && 'Mi Canasta Don José'}
                  {effectiveStep === 'checkout' && 'Etapa de Facturación'}
                  {effectiveStep === 'success' && '¡Orden Registrada!'}
                </h2>
                <p className="text-xs text-donjose-cream/75">
                  {effectiveStep === 'cart' && `${totalItems} ${totalItems === 1 ? 'unidad' : 'unidades'} seleccionadas`}
                  {effectiveStep === 'checkout' && 'Ingresa tus datos para la entrega'}
                  {effectiveStep === 'success' && 'Tanda confirmada en cocina'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseAndReset}
              className="p-2 text-donjose-cream/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-donjose-orange"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo Central del Drawer */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* VISTA 1: ÉXITO DE COMPRA */}
            {effectiveStep === 'success' && completedOrder && (
              <div className="text-center py-6 space-y-5 animate-fadeIn">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-donjose-orange">
                    Cochabamba • Hornada Matutina
                  </span>
                  <h3 className="font-heading font-black text-2xl text-donjose-brown mt-1">
                    ¡Gracias por tu Pedido!
                  </h3>
                  <p className="text-xs sm:text-sm text-donjose-brown/80 mt-1">
                    Estimado(a) <strong>{completedOrder.customerName}</strong>, tu orden está en preparación.
                  </p>
                </div>

                {/* Comprobante de Resumen */}
                <div className="bg-donjose-cream/40 border border-donjose-cream rounded-2xl p-4 text-left text-xs space-y-2 text-donjose-brown">
                  <div className="flex justify-between items-center pb-2 border-b border-donjose-cream/80">
                    <span className="font-semibold text-donjose-brown/70">Código de Orden:</span>
                    <span className="font-mono font-bold text-donjose-orange bg-white px-2 py-0.5 rounded border border-donjose-cream">
                      {completedOrder.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-donjose-brown/70">Hora de Registro:</span>
                    <span>{completedOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-donjose-brown/70">Teléfono:</span>
                    <span>{completedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-donjose-brown/70">NIT / CI:</span>
                    <span>{completedOrder.nit}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-donjose-cream/80 text-sm">
                    <span className="font-heading font-bold text-donjose-brown">Total a Pagar:</span>
                    <span className="font-heading font-black text-donjose-orange">
                      Bs {completedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-[11px] text-amber-900 flex items-start gap-2">
                  <Flame className="w-4 h-4 text-donjose-orange shrink-0 mt-0.5" />
                  <span>
                    <strong>Consejo Don José:</strong> Consume tus salteñas dentro de los primeros 45 minutos para disfrutar del jigote caliente y la masa crocante.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="w-full bg-donjose-orange hover:bg-donjose-orange/90 text-white font-heading font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-donjose-orange/25 active:scale-95 transition-all"
                >
                  Regresar al Menú
                </button>
              </div>
            )}

            {/* VISTA 2: CARRITO VACÍO (Advertencia operativa) */}
            {effectiveStep === 'cart' && cart.length === 0 && (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-20 h-20 bg-donjose-cream/50 text-donjose-brown/40 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-donjose-cream">
                  <ShoppingBag className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-xl text-donjose-brown">
                    Tu canasta está vacía
                  </h3>
                  {/* Advertencia operativa */}
                  <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl text-left flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 leading-relaxed font-normal">
                      <strong>Aviso Operativo:</strong> Nuestras salteñas se hornean en tandas matutinas limitadas (07:30 a 13:00). Agrega tus variedades favoritas para asegurar tu porción antes de que se agote la producción diaria.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 bg-donjose-brown hover:bg-donjose-orange text-white font-heading font-semibold text-sm py-3 px-4 rounded-2xl shadow-md transition-colors"
                >
                  Explorar Catálogo de Salteñas
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* VISTA 3: LISTA DETALLADA DE PRODUCTOS CON SUBTOTAL POR LÍNEA */}
            {effectiveStep === 'cart' && cart.length > 0 && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-donjose-brown/70 pb-1">
                  <span>Productos ({totalItems} unidades)</span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar todo
                  </button>
                </div>

                {cart.map((item) => {
                  const lineSubtotal = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white border border-donjose-cream rounded-2xl shadow-sm flex items-center gap-3 transition-all hover:border-donjose-orange/40"
                    >
                      {/* Miniatura */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-donjose-cream/70"
                      />

                      {/* Detalles y Subtotal por Línea */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-heading font-bold text-sm text-donjose-brown truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-donjose-brown/40 hover:text-red-600 transition-colors"
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-donjose-brown/70 mt-0.5">
                          <span>Bs {item.price.toFixed(2)} c/u</span>
                          {item.spicyLevel > 0 && (
                            <span className="flex items-center gap-0.5 text-donjose-orange font-bold text-[10px]">
                              <Flame className="w-3 h-3 fill-donjose-orange" />
                              Nivel {item.spicyLevel}
                            </span>
                          )}
                        </div>

                        {/* Controles de Cantidad y Subtotal por Línea */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-donjose-cream/50">
                          <div className="flex items-center bg-[#FDFBF7] border border-donjose-cream rounded-xl p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-donjose-brown hover:bg-donjose-cream/60 active:scale-95 transition-colors"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-heading font-bold text-xs text-donjose-brown w-6 text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-donjose-brown hover:bg-donjose-cream/60 active:scale-95 transition-colors"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase text-donjose-brown/60 block">
                              Subtotal
                            </span>
                            <span className="font-heading font-black text-sm text-donjose-orange">
                              Bs {lineSubtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VISTA 4: FORMULARIO DE CHECKOUT Y DATOS DE PAGO */}
            {effectiveStep === 'checkout' && (
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 animate-fadeIn">
                <div className="bg-white p-4 rounded-2xl border border-donjose-cream shadow-sm space-y-3">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-donjose-brown flex items-center gap-2">
                    <User className="w-4 h-4 text-donjose-orange" />
                    Datos para Entrega / Factura
                  </h4>

                  <div className="relative">
                    <User className="w-4 h-4 text-donjose-brown/40 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Nombre y Apellido"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-donjose-cream bg-[#FDFBF7] focus:outline-none focus:border-donjose-orange"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-donjose-brown/40 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="Celular / WhatsApp para confirmación"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-donjose-cream bg-[#FDFBF7] focus:outline-none focus:border-donjose-orange"
                    />
                  </div>

                  <div className="relative">
                    <FileText className="w-4 h-4 text-donjose-brown/40 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="NIT o Carnet de Identidad (Opcional)"
                      value={nit}
                      onChange={(e) => setNit(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-donjose-cream bg-[#FDFBF7] focus:outline-none focus:border-donjose-orange"
                    />
                  </div>
                </div>

                {/* Métodos de Pago Disponibles en Bolivia */}
                <div className="bg-white p-4 rounded-2xl border border-donjose-cream shadow-sm space-y-3">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-donjose-brown flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-donjose-orange" />
                    Forma de Pago
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qr')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'qr'
                          ? 'border-donjose-orange bg-donjose-orange/10 text-donjose-brown font-bold shadow-sm'
                          : 'border-donjose-cream/80 bg-[#FDFBF7] text-donjose-brown/70 hover:bg-donjose-cream/30'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-donjose-orange" />
                      <span className="text-[11px]">QR Simple</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('efectivo')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'efectivo'
                          ? 'border-donjose-orange bg-donjose-orange/10 text-donjose-brown font-bold shadow-sm'
                          : 'border-donjose-cream/80 bg-[#FDFBF7] text-donjose-brown/70 hover:bg-donjose-cream/30'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-donjose-orange" />
                      <span className="text-[11px]">Efectivo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('tarjeta')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'tarjeta'
                          ? 'border-donjose-orange bg-donjose-orange/10 text-donjose-brown font-bold shadow-sm'
                          : 'border-donjose-cream/80 bg-[#FDFBF7] text-donjose-brown/70 hover:bg-donjose-cream/30'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-donjose-orange" />
                      <span className="text-[11px]">Tarjeta</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Pie del Drawer: Resumen Financiero y Botón de Navegación */}
          {cart.length > 0 && effectiveStep !== 'success' && (
            <div className="p-5 sm:p-6 bg-donjose-cream/30 border-t border-donjose-cream space-y-4">
              {/* Resumen Financiero */}
              <div className="space-y-1.5 text-xs text-donjose-brown">
                <div className="flex justify-between">
                  <span className="text-donjose-brown/75">Subtotal de productos:</span>
                  <span className="font-semibold">Bs {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Modalidad de Retiro:</span>
                  <span className="font-semibold">Mostrador / Local (Gratis)</span>
                </div>
                <div className="pt-2 border-t border-donjose-cream flex items-baseline justify-between">
                  <div>
                    <span className="font-heading font-bold text-sm text-donjose-brown block">
                      Importe Total a Pagar
                    </span>
                    <span className="text-[11px] text-donjose-brown/60">
                      Precios oficiales en Bolivianos (BOB)
                    </span>
                  </div>
                  <span className="font-heading font-black text-2xl sm:text-3xl text-donjose-orange">
                    Bs {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botón de Navegación según el paso */}
              {effectiveStep === 'cart' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onProceedToCheckout) {
                      onProceedToCheckout();
                    } else {
                      setCurrentStep('checkout');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-donjose-orange hover:bg-donjose-orange/90 text-white font-heading font-bold text-base py-3.5 px-4 rounded-2xl shadow-lg shadow-donjose-orange/25 active:scale-[0.99] transition-all"
                >
                  Continuar al Pago
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full flex items-center justify-center gap-2 bg-donjose-brown hover:bg-donjose-orange text-white font-heading font-bold text-base py-3.5 px-4 rounded-2xl shadow-lg transition-all"
                >
                  Confirmar y Finalizar Pedido
                  <CheckCircle className="w-5 h-5 text-donjose-cream" />
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
