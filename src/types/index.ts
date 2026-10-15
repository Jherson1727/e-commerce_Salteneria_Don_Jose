/**
 * Entidades y tipos de dominio para Salteñería Don José
 */

export type ProductCategory = 'salteñas' | 'bebidas';

export type SpicyLevel = 0 | 1 | 2 | 3;

export type OrderStatus = 'pendiente' | 'pagado';

/**
 * Representa un producto del menú y catálogo oficial
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Expresado en Bolivianos (BOB)
  category: ProductCategory;
  image: string;
  spicyLevel: SpicyLevel; // 0 = Sin picante, 1 = Medio/Tradicional, 2 = Picante, 3 = Extra Picante
  isBestSeller: boolean;
}

/**
 * Extensión de Product para el carrito de compras con control de cantidad
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Modelo de datos para las órdenes de pedido registradas
 */
export interface Order {
  id: string;
  customerName: string;
  phone: string;
  nit: string;
  items: CartItem[];
  total: number; // Monto total en BOB
  date: string; // Formato ISO o legible (ej. YYYY-MM-DD HH:mm)
  status: OrderStatus;
}

/**
 * Información institucional y fundamentos estratégicos de la empresa
 */
export interface CompanyInfo {
  name: string;
  slogan: string;
  mission: string;
  vision: string;
  city: string;
  department: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  businessHours: string;
  values: {
    title: string;
    description: string;
  }[];
}
