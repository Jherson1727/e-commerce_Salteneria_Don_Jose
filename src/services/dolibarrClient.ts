import axios, { type AxiosInstance } from 'axios';

import { getToken } from './sesion';

/**
 * Cliente HTTP centralizado para la API REST de Dolibarr
 * (mismo patrón que el ejemplo del docente: axios + cabecera DOLAPIKEY).
 *
 * El navegador nunca habla directo con Dolibarr ni conoce su clave: todas las
 * peticiones van a /api, la función del servidor (api/dolibarr.js), que agrega
 * la clave del usuario de servicio "ecommerce" desde las variables de entorno.
 *
 *  - tiendaClient: lo usa el e-commerce, sin clave en el navegador.
 *  - adminClient: lo usa el panel /admin y envía el token de la sesión del
 *    administrador (inicio de sesión con usuario y contraseña de Dolibarr).
 */
export const API_BASE_URL = '/api';

const createDolibarrClient = (getKey: () => string): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Inyecta el token de la sesión, si lo hay
  client.interceptors.request.use((config) => {
    const key = getKey();
    if (key) config.headers.DOLAPIKEY = key;
    return config;
  });

  return client;
};

export const tiendaClient = createDolibarrClient(() => '');

export const adminClient = createDolibarrClient(getToken);

/** Normaliza los mensajes de error que devuelve Dolibarr. */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isCancel(error)) return 'Petición cancelada';
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: { message?: string }; message?: string }
      | undefined;
    if (!error.response) {
      return 'No se pudo conectar con el servidor de la tienda.';
    }
    if (error.response.status === 401) {
      return 'La sesión no es válida o no tiene permisos. Vuelve a iniciar sesión.';
    }
    return data?.error?.message || data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido al comunicarse con Dolibarr';
};
