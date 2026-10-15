import React, { useState } from 'react';
import {
  Compass,
  Eye,
  Award,
  ChevronDown,
  Quote,
  Sparkles,
  CheckCircle2,
  Heart,
  Flame,
  Wheat,
  Clock,
  Users
} from 'lucide-react';
import { COMPANY_INFO } from '../data/products';

type TabKey = 'mision' | 'vision' | 'valores';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('mision');
  const [expandedValueIndex, setExpandedValueIndex] = useState<number | null>(0);

  const toggleValue = (index: number) => {
    setExpandedValueIndex(expandedValueIndex === index ? null : index);
  };

  const pillars = [
    {
      icon: <Wheat className="w-6 h-6 text-donjose-orange" />,
      title: 'Ingredientes 100% del Valle',
      desc: 'Papas imillas seleccionadas, carnes de primera calidad y ajíes molidos a batán tradicional.',
    },
    {
      icon: <Clock className="w-6 h-6 text-donjose-orange" />,
      title: 'Horneadas Cada 30 Minutos',
      desc: 'Salen de nuestros hornos calientes y crujientes desde las 7:30 a.m. sin recalentados.',
    },
    {
      icon: <Flame className="w-6 h-6 text-donjose-orange" />,
      title: 'Jigote Hiperjugoso',
      desc: 'Cocción lenta de 12 horas de reducción de caldo enriquecido con hierbas de altura.',
    },
    {
      icon: <Users className="w-6 h-6 text-donjose-orange" />,
      title: 'Encuentro Familiar',
      desc: 'Un espacio cálido donde cochabambinos y visitantes se unen en torno a un buen desayuno.',
    },
  ];

  return (
    <section id="historia" className="py-20 bg-gradient-to-b from-[#FDFBF7] via-donjose-cream/30 to-[#FDFBF7] relative overflow-hidden">
      {/* Elementos gráficos decorativos de fondo */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-donjose-cream/50 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-donjose-orange/10 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera didáctica */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-donjose-orange/15 border border-donjose-orange/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-donjose-brown mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-donjose-orange" />
            Identidad y Fundamentos Estratégicos
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-donjose-brown tracking-tight mb-4">
            Nuestra Esencia y Compromiso con el Valle
          </h2>
          <p className="text-base sm:text-lg text-donjose-brown/80 leading-relaxed font-normal">
            Conoce los pilares que hacen de Salteñería Don José el punto de encuentro predilecto de las mañanas en Cochabamba.
          </p>
        </div>

        {/* Destacado: Eslogan Oficial de Marca */}
        <div className="mb-14 bg-gradient-to-r from-donjose-brown via-[#5A251E] to-donjose-brown rounded-3xl p-8 sm:p-10 shadow-donjose-lg text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <Quote className="w-64 h-64 text-donjose-cream" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-donjose-orange rounded-2xl shadow-lg shrink-0 mt-1">
                <Quote className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-donjose-cream/80 font-bold block mb-1">
                  Eslogan Oficial de Marca
                </span>
                <p className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-donjose-cream italic tracking-tight">
                  "{COMPANY_INFO.slogan}"
                </p>
                <p className="text-sm text-donjose-cream/75 mt-2 font-light">
                  El lema que guía nuestras manos en el repulgue diario y la calidez de nuestro servicio matutino.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl">
              <Award className="w-6 h-6 text-donjose-orange" />
              <div className="text-left">
                <span className="block text-xs uppercase text-donjose-cream/70 font-semibold">Garantía</span>
                <span className="font-heading font-bold text-sm text-white">Sabor 100% Auténtico</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Interactivo Didáctico: Misión, Visión y Valores */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Navegación por Pestañas Interactivas */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-heading font-bold text-xl text-donjose-brown mb-4 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-donjose-orange rounded-full inline-block"></span>
              Fundamentos Corporativos
            </h3>

            {/* Pestaña Misión */}
            <button
              type="button"
              onClick={() => setActiveTab('mision')}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border flex items-center justify-between ${
                activeTab === 'mision'
                  ? 'bg-white border-donjose-orange shadow-md shadow-donjose-orange/10 scale-[1.01]'
                  : 'bg-white/60 hover:bg-white border-donjose-cream/70 text-donjose-brown/80'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    activeTab === 'mision' ? 'bg-donjose-orange text-white shadow' : 'bg-donjose-cream/50 text-donjose-brown'
                  }`}
                >
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-donjose-brown">Nuestra Misión</h4>
                  <p className="text-xs text-donjose-brown/70 font-normal">La razón de ser y propósito cotidiano</p>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  activeTab === 'mision' ? 'bg-donjose-orange/15 text-donjose-orange' : 'text-donjose-brown/50'
                }`}
              >
                {activeTab === 'mision' ? 'Activo' : 'Ver'}
              </span>
            </button>

            {/* Pestaña Visión */}
            <button
              type="button"
              onClick={() => setActiveTab('vision')}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border flex items-center justify-between ${
                activeTab === 'vision'
                  ? 'bg-white border-donjose-orange shadow-md shadow-donjose-orange/10 scale-[1.01]'
                  : 'bg-white/60 hover:bg-white border-donjose-cream/70 text-donjose-brown/80'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    activeTab === 'vision' ? 'bg-donjose-orange text-white shadow' : 'bg-donjose-cream/50 text-donjose-brown'
                  }`}
                >
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-donjose-brown">Nuestra Visión</h4>
                  <p className="text-xs text-donjose-brown/70 font-normal">Hacia dónde proyectamos nuestro legado</p>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  activeTab === 'vision' ? 'bg-donjose-orange/15 text-donjose-orange' : 'text-donjose-brown/50'
                }`}
              >
                {activeTab === 'vision' ? 'Activo' : 'Ver'}
              </span>
            </button>

            {/* Pestaña Valores */}
            <button
              type="button"
              onClick={() => setActiveTab('valores')}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border flex items-center justify-between ${
                activeTab === 'valores'
                  ? 'bg-white border-donjose-orange shadow-md shadow-donjose-orange/10 scale-[1.01]'
                  : 'bg-white/60 hover:bg-white border-donjose-cream/70 text-donjose-brown/80'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    activeTab === 'valores' ? 'bg-donjose-orange text-white shadow' : 'bg-donjose-cream/50 text-donjose-brown'
                  }`}
                >
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-donjose-brown">Valores Institucionales</h4>
                  <p className="text-xs text-donjose-brown/70 font-normal">Principios éticos y de calidad</p>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  activeTab === 'valores' ? 'bg-donjose-orange/15 text-donjose-orange' : 'text-donjose-brown/50'
                }`}
              >
                {activeTab === 'valores' ? 'Activo' : 'Ver'}
              </span>
            </button>
          </div>

          {/* Visualizador de Contenido Didáctico Dinámico */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-donjose-cream shadow-donjose min-h-[380px] flex flex-col justify-between">
            {activeTab === 'mision' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-donjose-orange/15 text-donjose-orange flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-donjose-orange">
                      Compromiso de Servicio
                    </span>
                    <h4 className="font-heading font-extrabold text-2xl text-donjose-brown">
                      Misión Institucional
                    </h4>
                  </div>
                </div>

                <div className="bg-donjose-cream/30 border-l-4 border-donjose-orange p-5 rounded-r-2xl">
                  <p className="text-lg text-donjose-brown leading-relaxed font-medium">
                    "{COMPANY_INFO.mission}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-donjose-cream/60">
                    <CheckCircle2 className="w-5 h-5 text-donjose-orange shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-donjose-brown/85 font-medium">
                      Elaboración diaria con ingredientes frescos locales de Cochabamba.
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-donjose-cream/60">
                    <CheckCircle2 className="w-5 h-5 text-donjose-orange shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-donjose-brown/85 font-medium">
                      Servicio cálido y un momento memorable para las familias bolivianas.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-donjose-orange/15 text-donjose-orange flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-donjose-orange">
                      Proyección Estratégica
                    </span>
                    <h4 className="font-heading font-extrabold text-2xl text-donjose-brown">
                      Visión Institucional
                    </h4>
                  </div>
                </div>

                <div className="bg-donjose-cream/30 border-l-4 border-donjose-brown p-5 rounded-r-2xl">
                  <p className="text-lg text-donjose-brown leading-relaxed font-medium">
                    "{COMPANY_INFO.vision}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-donjose-cream/60">
                    <CheckCircle2 className="w-5 h-5 text-donjose-brown shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-donjose-brown/85 font-medium">
                      Punto de referencia gastronómico por mantener viva la tradición.
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-donjose-cream/60">
                    <CheckCircle2 className="w-5 h-5 text-donjose-brown shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-donjose-brown/85 font-medium">
                      Lugar de preferencia para reunir a las generaciones bolivianas.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'valores' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-donjose-orange/15 text-donjose-orange flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-donjose-orange">
                      Nuestra Filosofía
                    </span>
                    <h4 className="font-heading font-extrabold text-2xl text-donjose-brown">
                      Valores Desplegables
                    </h4>
                  </div>
                </div>

                {/* Acordeón desplegable de valores */}
                <div className="space-y-2.5">
                  {COMPANY_INFO.values.map((val, idx) => {
                    const isExpanded = expandedValueIndex === idx;
                    return (
                      <div
                        key={val.title}
                        className="border border-donjose-cream/80 rounded-2xl overflow-hidden transition-all duration-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleValue(idx)}
                          className={`w-full p-3.5 sm:p-4 text-left flex items-center justify-between transition-colors ${
                            isExpanded ? 'bg-donjose-cream/40 font-semibold' : 'bg-white hover:bg-donjose-cream/20'
                          }`}
                        >
                          <span className="font-heading font-bold text-sm sm:text-base text-donjose-brown flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-donjose-orange text-white text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            {val.title}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-donjose-brown/70 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 text-donjose-orange' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="px-5 py-3.5 bg-donjose-cream/15 text-sm text-donjose-brown/85 border-t border-donjose-cream/50 leading-relaxed animate-fadeIn">
                            {val.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pie didáctico con sello de Cochabamba */}
            <div className="pt-6 mt-6 border-t border-donjose-cream/60 flex items-center justify-between text-xs text-donjose-brown/70">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-donjose-orange"></span>
                Receta artesanal cochabambina
              </span>
              <span className="font-semibold text-donjose-brown">
                {COMPANY_INFO.department}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pilares Didácticos Visuales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 rounded-2xl border border-donjose-cream shadow-sm hover:shadow-donjose hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-donjose-cream/60 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h4 className="font-heading font-bold text-lg text-donjose-brown mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-donjose-brown/75 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
