import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Clock,
  QrCode,
  User,
  Phone,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderReceipt } from './OrderReceipt';
import type { Order } from '../types';
import { VentasService } from '../services/ventasService';
import { getErrorMessage } from '../services/dolibarrClient';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted?: (order: Order) => void;
}

type CheckoutStep = 1 | 2 | 3; // 1: Datos del Cliente, 2: Pasarela QR, 3: Recibo Final

const QR_EXPIRE_SECONDS = 180; // 03:00 minutos

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { cart, totalPrice, clearCart } = useCart();

  // Estados del flujo
  const [step, setStep] = useState<CheckoutStep>(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [nit, setNit] = useState('');
  const [errors, setErrors] = useState<{ customerName?: string; phone?: string }>({});

  // Estados de la pasarela QR
  const [orderId, setOrderId] = useState('');
  const [timeLeft, setTimeLeft] = useState(QR_EXPIRE_SECONDS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [paymentError, setPaymentError] = useState('');

  // Generar correlativo ORD-2026-XXXX al abrir o regenerar
  const generateNewOrderId = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORD-2026-${randomSuffix}`;
  };

  // Si el modal se cierra estando en el recibo (Escape, etc.), se reinicia
  // para que la próxima compra empiece de cero y no muestre el recibo anterior.
  useEffect(() => {
    if (!isOpen && step === 3) {
      setStep(1);
      setCustomerName('');
      setPhone('');
      setNit('');
      setOrderId('');
      setCompletedOrder(null);
      setPaymentError('');
    }
  }, [isOpen, step]);

  // Manejo de accesibilidad: tecla Escape y bloqueo de scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
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
  }, [isOpen, isProcessing, onClose]);

  // Temporizador regresivo de 03:00 minutos para el QR
  useEffect(() => {
    if (!isOpen || step !== 2 || timeLeft <= 0 || isProcessing) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, step, timeLeft, isProcessing]);

  // Formato mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Validación y pase a Paso 2
  const handleProceedToQR = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { customerName?: string; phone?: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Por favor ingresa tu nombre completo.';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Ingresa un número de celular o WhatsApp de contacto.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (!orderId) {
      setOrderId(generateNewOrderId());
    }
    setTimeLeft(QR_EXPIRE_SECONDS);
    setStep(2);
  };

  // Pago (simulado) + registro REAL de la venta en Dolibarr:
  // crea la factura a nombre de "Cliente Web" y la valida en ALM-POS (descuenta stock).
  const handleSimulatePayment = async () => {
    if (timeLeft <= 0 || isProcessing) return;

    setIsProcessing(true);
    setPaymentError('');

    try {
      const venta = await VentasService.registrarVenta(
        cart,
        { nombre: customerName.trim(), celular: phone.trim(), nit: nit.trim() || '0' },
        orderId
      );

      const now = new Date();
      const formattedDate = `${now.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} ${now.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`;

      const finalOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        nit: nit.trim() || '0',
        items: [...cart],
        total: totalPrice,
        date: formattedDate,
        status: 'pagado',
        facturaRef: venta.facturaRef,
        cobroRegistrado: venta.pagoRegistrado,
      };

      setCompletedOrder(finalOrder);
      // La venta ya está registrada: se vacía el carrito de inmediato
      // (el recibo usa su propia copia de los productos en finalOrder).
      clearCart();
      setStep(3); // Avanzar a Recibo Final
      if (onOrderCompleted) {
        onOrderCompleted(finalOrder);
      }
    } catch (error) {
      setPaymentError(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  // Regenerar QR cuando expira
  const handleRegenerateQR = () => {
    setOrderId(generateNewOrderId());
    setTimeLeft(QR_EXPIRE_SECONDS);
  };

  // Cerrar y reiniciar formulario
  const handleCloseReceiptAndReset = () => {
    clearCart();
    setStep(1);
    setCustomerName('');
    setPhone('');
    setNit('');
    setOrderId('');
    setCompletedOrder(null);
    setPaymentError('');
    onClose();
  };

  if (!isOpen) return null;

  // Cadena de interoperabilidad interbancaria boliviana
  const qrPayload = `pagoqr://donjose.com.bo/pay?monto=${totalPrice.toFixed(
    2
  )}&orden=${orderId}&moneda=BOB`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
      aria-label="Proceso de Checkout y Pago Simple QR"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-donjose-brown/70 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isProcessing && step !== 3) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FDFBF7] w-full max-w-xl rounded-3xl shadow-2xl border border-donjose-cream overflow-hidden z-10 animate-fadeIn">
        {/* Cabecera del Modal (Oculta en paso 3 para dar protagonismo al recibo) */}
        {step !== 3 && (
          <div className="p-5 sm:p-6 bg-donjose-brown text-donjose-cream flex items-center justify-between border-b border-donjose-brown/80 shadow-md">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setStep(1)}
                  className="p-1.5 -ml-1 text-donjose-cream/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
                  aria-label="Volver al Paso 1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-10 h-10 rounded-xl bg-donjose-orange flex items-center justify-center text-white shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-donjose-cream leading-tight">
                  {step === 1 && 'Paso 1: Datos del Cliente'}
                  {step === 2 && 'Paso 2: Pasarela Simple QR'}
                </h3>
                <p className="text-xs text-donjose-cream/75">
                  {step === 1 && 'Información de contacto y facturación'}
                  {step === 2 && 'Cobro interoperable ASOBAN Bolivia'}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="p-2 text-donjose-cream/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Indicador de Progreso (Pasos 1 y 2) */}
        {step !== 3 && (
          <div className="px-6 pt-4 pb-2 bg-donjose-cream/20 border-b border-donjose-cream/60 flex items-center justify-between text-xs font-semibold text-donjose-brown">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 1 ? 'bg-donjose-orange text-white' : 'bg-donjose-cream text-donjose-brown'
                }`}
              >
                1
              </span>
              <span>Datos</span>
            </div>
            <div className="w-12 h-0.5 bg-donjose-cream" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? 'bg-donjose-orange text-white' : 'bg-donjose-cream text-donjose-brown'
                }`}
              >
                2
              </span>
              <span>Pago QR</span>
            </div>
            <div className="w-12 h-0.5 bg-donjose-cream" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-donjose-cream text-donjose-brown/50">
                3
              </span>
              <span>Recibo</span>
            </div>
          </div>
        )}

        {/* Contenido Principal */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* PASO 1: FORMULARIO DE DATOS DEL CLIENTE */}
          {step === 1 && (
            <form onSubmit={handleProceedToQR} className="space-y-5 animate-fadeIn">
              <div className="bg-donjose-cream/30 border border-donjose-cream p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-donjose-brown/70 block">Total a Cancelar:</span>
                  <span className="font-heading font-black text-2xl text-donjose-orange">
                    Bs {totalPrice.toFixed(2)}
                  </span>
                </div>
                <span className="text-xs bg-white text-donjose-brown px-3 py-1.5 rounded-xl border border-donjose-cream font-bold">
                  {cart.reduce((a, b) => a + b.quantity, 0)} unidades
                </span>
              </div>

              {/* Campo Nombre Completo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-heading font-bold text-donjose-brown uppercase tracking-wider">
                  Nombre Completo <span className="text-donjose-orange">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-donjose-brown/50 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Ej. María Elena Rodríguez"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: undefined }));
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm bg-white text-donjose-brown focus:outline-none focus:ring-2 transition-all ${
                      errors.customerName
                        ? 'border-red-500 focus:ring-red-300'
                        : 'border-donjose-cream focus:border-donjose-orange focus:ring-donjose-orange/20'
                    }`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Campo Celular / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-heading font-bold text-donjose-brown uppercase tracking-wider">
                  Celular / WhatsApp <span className="text-donjose-orange">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-donjose-brown/50 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="Ej. 71723456"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm bg-white text-donjose-brown focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-red-500 focus:ring-red-300'
                        : 'border-donjose-cream focus:border-donjose-orange focus:ring-donjose-orange/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Campo NIT / CI */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-heading font-bold text-donjose-brown uppercase tracking-wider">
                    NIT / C.I. (Facturación)
                  </label>
                  <span className="text-[11px] text-donjose-brown/60">Opcional (o '0' para s/n)</span>
                </div>
                <div className="relative">
                  <FileText className="w-4 h-4 text-donjose-brown/50 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Ej. 654321015"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-donjose-cream text-sm bg-white text-donjose-brown focus:outline-none focus:border-donjose-orange focus:ring-2 focus:ring-donjose-orange/20 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-donjose-orange hover:bg-donjose-orange/90 text-white font-heading font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-donjose-orange/25 active:scale-[0.99] transition-all"
                >
                  Continuar a Pasarela Simple QR
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* PASO 2: PASARELA SIMPLE QR CON TEMPORIZADOR Y SIMULACIÓN */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn text-center">
              {/* Tarjeta del Código QR con Branding */}
              <div className="bg-white p-6 rounded-3xl border-2 border-donjose-cream shadow-md max-w-xs mx-auto relative">
                {/* Banner Simple QR Bolivia */}
                <div className="flex items-center justify-center gap-1.5 mb-3 bg-gradient-to-r from-[#003B70] via-[#00609C] to-[#00A3E0] text-white py-1.5 px-4 rounded-xl shadow-sm text-xs font-heading font-black tracking-wider">
                  <QrCode className="w-4 h-4" />
                  <span>PAGO SIMPLE QR</span>
                </div>

                {/* Render dinámico con qrcode.react */}
                <div className="flex justify-center p-2 bg-[#FDFBF7] rounded-2xl border border-donjose-cream">
                  <QRCodeSVG
                    value={qrPayload}
                    size={190}
                    level="H"
                    includeMargin={false}
                    fgColor="#6B2D24"
                    bgColor="#FDFBF7"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-donjose-brown font-mono">
                  <span>ORDEN: <strong>{orderId}</strong></span>
                  <span className="text-donjose-orange font-bold font-sans">
                    Bs {totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Alerta de expiración si el temporizador llega a cero */}
                {timeLeft === 0 && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-4 space-y-3 z-10 animate-fadeIn">
                    <AlertCircle className="w-10 h-10 text-red-500 animate-bounce" />
                    <p className="font-heading font-bold text-sm text-donjose-brown">
                      El código QR ha expirado
                    </p>
                    <p className="text-xs text-donjose-brown/70 max-w-xs">
                      Por seguridad interbancaria, los códigos QR caducan a los 3 minutos.
                    </p>
                    <button
                      type="button"
                      onClick={handleRegenerateQR}
                      className="inline-flex items-center gap-1.5 bg-donjose-orange text-white text-xs font-bold py-2 px-4 rounded-xl shadow hover:bg-donjose-orange/90 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Generar Nuevo QR
                    </button>
                  </div>
                )}
              </div>

              {/* Temporizador Regresivo de 03:00 minutos */}
              <div className="inline-flex items-center gap-2 bg-donjose-cream/40 border border-donjose-cream px-4 py-2 rounded-2xl shadow-sm">
                <Clock className={`w-4 h-4 ${timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-donjose-orange'}`} />
                <span className="text-xs font-semibold text-donjose-brown">
                  Tiempo restante para pagar:{' '}
                  <strong className={`font-mono text-sm ${timeLeft <= 30 ? 'text-red-600' : 'text-donjose-orange'}`}>
                    {formatTimer(timeLeft)}
                  </strong>
                </span>
              </div>

              {/* Instrucciones Didácticas Oficiales */}
              <div className="bg-white p-4 rounded-2xl border border-donjose-cream text-left space-y-2.5 shadow-sm">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-donjose-brown flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Instrucciones de Pago Interbancario:
                </h4>
                <ol className="text-xs text-donjose-brown/85 space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-donjose-orange text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Abre tu aplicación bancaria móvil (Banco Unión, BCP, BNB, BancoSol, etc.).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-donjose-orange text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Selecciona la opción <strong>Pago Simple QR</strong> en el menú de transferencias.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-donjose-orange text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Escanea este código y confirma el monto de <strong>Bs {totalPrice.toFixed(2)}</strong>.</span>
                  </li>
                </ol>
              </div>

              {/* Botón Interactivo de Simulación con Spinner de 2 segundos */}
              <div>
                <button
                  type="button"
                  disabled={timeLeft === 0 || isProcessing}
                  onClick={handleSimulatePayment}
                  className={`w-full flex items-center justify-center gap-2.5 font-heading font-bold text-sm sm:text-base py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 ${
                    isProcessing
                      ? 'bg-amber-600 text-white cursor-wait'
                      : timeLeft === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-[0.99]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Registrando la venta en Dolibarr...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Simular pago y registrar venta</span>
                    </>
                  )}
                </button>
                {paymentError && (
                  <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-xs text-left rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>No se pudo registrar la venta.</strong> {paymentError}
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-donjose-brown/60 mt-2">
                  * El pago QR es simulado; la venta sí se registra en Dolibarr y descuenta el stock.
                </p>
              </div>
            </div>
          )}

          {/* PASO 3: RECIBO FORMAL CON CONFETI */}
          {step === 3 && completedOrder && (
            <OrderReceipt order={completedOrder} onClose={handleCloseReceiptAndReset} />
          )}
        </div>
      </div>
    </div>
  );
};
