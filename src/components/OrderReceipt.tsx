import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { Printer, CheckCircle2, Flame, ChevronDown } from 'lucide-react';
import type { Order } from '../types';
import { COMPANY_INFO } from '../data/products';

interface OrderReceiptProps {
  order: Order;
  onClose: () => void;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, onClose }) => {
  const actionsRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Disparo festivo de confeti al montar el componente
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF8434', '#F5E6C8', '#6B2D24', '#FFA666', '#FFFFFF'],
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF8434', '#6B2D24', '#22C55E'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF8434', '#6B2D24', '#22C55E'],
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  // Observa si los botones inferiores ya están visibles en pantalla
  useEffect(() => {
    const currentActions = actionsRef.current;
    if (!currentActions) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollHint(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(currentActions);
    return () => observer.disconnect();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const scrollToActions = () => {
    actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // Contenido del ticket (se usa en pantalla y en la versión para imprimir)
  const ticket = (
    <>
      {/* Marca de agua decorativa */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <Flame className="w-96 h-96 text-donjose-brown" />
      </div>

      {/* Encabezado Institucional */}
      <div className="text-center pb-5 border-b border-dashed border-donjose-cream relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
            <img src="/images/Logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h4 className="font-heading font-extrabold text-base tracking-tight text-donjose-brown uppercase">
            Salteñería Don José - Cochabamba
          </h4>
        </div>
        <p className="text-[11px] text-donjose-brown/80 italic font-sans">
          "{COMPANY_INFO.slogan}"
        </p>
        <p className="text-[10px] text-donjose-brown/60 mt-1">
          {COMPANY_INFO.address}
        </p>
        <p className="text-[10px] text-donjose-brown/60">
          NIT: 1029384756 • Cochabamba, Bolivia
        </p>
      </div>

      {/* Metadatos de la Orden */}
      <div className="py-4 border-b border-dashed border-donjose-cream space-y-1 relative z-10">
        <div className="flex justify-between items-center">
          <span className="font-bold">N° DE ORDEN:</span>
          <span className="font-bold text-donjose-orange text-sm bg-donjose-cream/40 px-2 py-0.5 rounded border border-donjose-cream">
            {order.id}
          </span>
        </div>
        {order.facturaRef && (
          <div className="flex justify-between">
            <span className="text-donjose-brown/70">FACTURA (DOLIBARR):</span>
            <span className="font-bold">{order.facturaRef}</span>
          </div>
        )}
        {order.facturaRef && (
          <div className="flex justify-between">
            <span className="text-donjose-brown/70">COBRO EN DOLIBARR:</span>
            <span className={`font-bold ${order.cobroRegistrado ? 'text-emerald-700' : 'text-amber-700'}`}>
              {order.cobroRegistrado ? 'REGISTRADO' : 'PENDIENTE'}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-donjose-brown/70">FECHA Y HORA:</span>
          <span>{order.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-donjose-brown/70">CLIENTE:</span>
          <span className="font-semibold uppercase">{order.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-donjose-brown/70">NIT / CI:</span>
          <span>{order.nit || '0'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-donjose-brown/70">TELÉFONO:</span>
          <span>{order.phone}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-donjose-brown/70">MÉTODO DE PAGO:</span>
          <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
            SIMPLE QR (PAGADO)
          </span>
        </div>
      </div>

      {/* Desglose Tabular de Productos */}
      <div className="py-4 border-b border-dashed border-donjose-cream relative z-10">
        <div className="grid grid-cols-12 font-bold text-[11px] text-donjose-brown/90 pb-2 border-b border-donjose-cream/80">
          <span className="col-span-2 text-center">CANT</span>
          <span className="col-span-6">DESCRIPCIÓN</span>
          <span className="col-span-2 text-right">P.UNIT</span>
          <span className="col-span-2 text-right">TOTAL</span>
        </div>

        <div className="divide-y divide-donjose-cream/40 pt-1">
          {order.items.map((item) => {
            const lineTotal = item.price * item.quantity;
            return (
              <div key={item.id} className="grid grid-cols-12 py-1.5 text-[11px] items-center">
                <span className="col-span-2 text-center font-bold text-donjose-brown">
                  {item.quantity}x
                </span>
                <div className="col-span-6 pr-1">
                  <span className="block font-semibold truncate text-donjose-brown">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-donjose-brown/60 block">
                    {item.category === 'salteñas' ? `Nivel picante: ${item.spicyLevel}` : 'Bebida'}
                  </span>
                </div>
                <span className="col-span-2 text-right text-donjose-brown/75">
                  {item.price.toFixed(2)}
                </span>
                <span className="col-span-2 text-right font-bold text-donjose-brown">
                  {lineTotal.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Final */}
      <div className="py-4 border-b border-dashed border-donjose-cream space-y-1 relative z-10">
        <div className="flex justify-between text-xs">
          <span>SUBTOTAL:</span>
          <span>Bs {order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-emerald-800">
          <span>MODALIDAD DE ENTREGA:</span>
          <span>Retiro en Local (0.00 Bs)</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 text-sm font-bold text-donjose-brown">
          <span className="font-heading uppercase">TOTAL PAGADO (BOB):</span>
          <span className="font-heading font-black text-xl text-donjose-orange">
            Bs {order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Mensaje de Agradecimiento */}
      <div className="pt-4 text-center space-y-2 relative z-10 font-sans">
        <div className="p-3 bg-donjose-cream/30 rounded-2xl border border-donjose-cream">
          <p className="text-xs text-donjose-brown leading-relaxed font-medium">
            ¡Gracias por compartir el sabor tradicional con tu familia! Tu pedido pasará a cocina inmediatamente.
          </p>
        </div>
        <p className="text-[10px] text-donjose-brown/60">
          Conserva este comprobante para recoger tu pedido en mostrador.
        </p>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-lg mx-auto animate-fadeIn relative">
      {/* Banner de Confirmación Exitosa */}
      <div className="text-center mb-6 no-print">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-md animate-bounce">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        <h3 className="font-heading font-black text-2xl text-donjose-brown">
          ¡Pago Confirmado con Éxito!
        </h3>
        <p className="text-xs sm:text-sm text-donjose-brown/80 mt-1">
          Tu transacción Simple QR ha sido verificada y tu pedido ingresó a la tanda de cocina.
        </p>
      </div>

      {/* Recibo / Ticket Térmico Digital */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-dashed border-donjose-cream shadow-xl font-mono text-xs text-donjose-brown relative overflow-hidden">
        {ticket}
      </div>

      {/* Indicador flotante animado para deslizar (se oculta automáticamente al llegar a los botones) */}
      {showScrollHint && (
        <div className="sticky bottom-3 z-30 flex justify-center no-print pointer-events-none mt-3 -mb-3 transition-opacity duration-300">
          <button
            type="button"
            onClick={scrollToActions}
            className="pointer-events-auto inline-flex items-center gap-1.5 bg-donjose-orange/95 hover:bg-donjose-orange text-white text-[11px] font-heading font-extrabold py-2 px-4 rounded-full shadow-lg shadow-donjose-orange/30 backdrop-blur-sm transition-transform active:scale-95 animate-bounce"
          >
            <span>Desliza para finalizar</span>
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Copia solo para impresión */}
      {createPortal(
        <div id="print-root">
          <div className="bg-white p-6 border-2 border-dashed border-donjose-brown font-mono text-xs text-donjose-brown relative">
            {ticket}
          </div>
        </div>,
        document.body
      )}

      {/* Botones de Acción */}
      <div ref={actionsRef} className="flex flex-col sm:flex-row items-center gap-3 mt-6 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-white hover:bg-donjose-cream/40 text-donjose-brown border border-donjose-cream font-heading font-bold text-sm py-3.5 px-4 rounded-2xl shadow-sm hover:border-donjose-orange/50 transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 text-donjose-orange" />
          Imprimir Recibo
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-donjose-orange hover:bg-donjose-orange/90 text-white font-heading font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-donjose-orange/25 transition-all active:scale-95"
        >
          Finalizar y Volver al Menú
        </button>
      </div>
    </div>
  );
};