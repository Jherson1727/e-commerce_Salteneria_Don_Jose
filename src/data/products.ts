import type { Product, CompanyInfo } from '../types';

/**
 * Catálogo maestro oficial sincronizado con el sistema ERP de Salteñería Don José
 */
export const PRODUCTS: Product[] = [
  {
    id: 'SAL-01',
    name: 'Salteña de Carne',
    description: 'Nuestra receta insignia: jugoso relleno de carne de res premium, papa imilla cocida en su punto, arvejas frescas, huevo duro y aceituna negra del valle, sazonada con un toque sutil y tradicional de ají amarillo.',
    price: 8.0,
    category: 'salteñas',
    image: '/images/carne.jpg',
    spicyLevel: 1,
    isBestSeller: true,
  },
  {
    id: 'SAL-02',
    name: 'Salteña de Pollo',
    description: 'Suaves trozos de pechuga de pollo desmenuzada lentamente en caldo casero aromatizado, verduras selectas, huevo y aceituna. 100% libre de picante, ideal para los más pequeños y toda la familia.',
    price: 8.0,
    category: 'salteñas',
    image: '/images/pollo.jpg',
    spicyLevel: 0,
    isBestSeller: false,
  },
  {
    id: 'SAL-03',
    name: 'Salteña Mixta',
    description: 'La combinación perfecta de carne de res y tierno pollo, cocinados en un jigote hiperjugoso con especias cochabambinas, huevo, papa y aceituna. El equilibrio supremo en cada bocado.',
    price: 9.0,
    category: 'salteñas',
    image: '/images/picante.jpg',
    spicyLevel: 1,
    isBestSeller: true,
  },
  {
    id: 'SAL-04',
    name: 'Salteña Picante',
    description: 'Para los verdaderos amantes del fuego tradicional. Jigote intenso enriquecido con ají rojo y locoto cochabambino macerado, carne de res seleccionada y ese caldo ultra caliente que despierta los sentidos.',
    price: 9.0,
    category: 'salteñas',
    image: '/images/picante.jpg',
    spicyLevel: 3,
    isBestSeller: false,
  },
  {
    id: 'BEB-01',
    name: 'Gaseosa / Refresco 500ml',
    description: 'Botella individual de 500ml servida al clima o bien helada. Variedades disponibles: Coca-Cola Clásica, Coca-Cola Sin Azúcar, Fanta y Sprite para acompañar tu salteña.',
    price: 7.0,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    spicyLevel: 0,
    isBestSeller: false,
  },
  {
    id: 'BEB-02',
    name: 'Jugo Natural / Mocochinchi',
    description: 'Bebida tradicional hervida lentamente con durazno deshidratado (k’isa), canela de ceiba, clavo de olor y azúcar caramelizada artesanal. Servido bien frío con su respectivo durazno entero.',
    price: 5.0,
    category: 'bebidas',
    image: '/images/mocochinchi.jpg',
    spicyLevel: 0,
    isBestSeller: true,
  },
];

/**
 * Información institucional y fundamentos estratégicos
 */
export const COMPANY_INFO: CompanyInfo = {
  name: 'Salteñería Don José',
  slogan: 'Tradición, sabor y confianza en cada salteña',
  mission:
    'Ser una empresa que preserva y comparte la autenticidad de la salteña tradicional, elaborando cada día un producto jugoso, fresco y de alta calidad con ingredientes locales, para brindar a las familias bolivianas un momento memorable a través de un servicio cálido y un sabor único.',
  vision:
    'Ser la salteñeria de referencia en la ciudad, reconocida por mantener viva la tradición gastronómica boliviana y por ser el punto de encuentro preferido de las familias para compartir momentos memorables alrededor de un sabor único.',
  city: 'Cochabamba',
  department: 'Cochabamba, Bolivia',
  address: 'Av. Heroínas esq. Ayacucho #450, Casco Viejo, Cochabamba',
  phone: '+591 4 4528990',
  whatsapp: '+591 71723456',
  email: 'contacto@donjose.bo',
  businessHours: 'Lunes a Domingo: 07:30 - 13:00 (o hasta agotar stock del día)',
  values: [
    {
      title: 'Autenticidad Culinaria',
      description: 'Preservamos la técnica centenaria del repulgue a mano, el horneado a alta temperatura y el jigote rebosante de caldo natural.',
    },
    {
      title: 'Ingredientes 100% Locales',
      description: 'Apoyamos a productores del valle cochabambino adquiriendo papas imillas selectas, carnes de primera calidad y especias autóctonas.',
    },
    {
      title: 'Frescura Diaria',
      description: 'No recalentamos ni congelamos salteñas sobrantes; horneamos tandas frescas cada 30 minutos desde las 7:00 a.m.',
    },
    {
      title: 'Calidez Familiar',
      description: 'Brindamos una atención cercana y acogedora, convirtiendo cada visita matutina en una reunión entrañable para familias y amigos.',
    },
  ],
};
