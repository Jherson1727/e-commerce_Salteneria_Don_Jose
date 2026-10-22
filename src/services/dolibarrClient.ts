import axios, { type AxiosInstance } from 'axios';

/**
 * Cliente HTTP centralizado para la API REST de Dolibarr
 * (mismo patrón que el ejemplo del docente: axios + cabecera DOLAPIKEY).
 *
 * Se crean DOS clientes con claves distintas:
 *  - tiendaClient: lo usa el e-commerce. Su clave sale del .env.local
 *    (usuario "ecommerce" con permisos mínimos).
 *  - adminClient: lo usa el panel de administración (/admin). Su clave la
 *    ingresa el administrador y se guarda en el navegador (localStorage).
 */
export const DOLIBARR_BASE_URL: string =
  import.meta.env.VITE_DOLIBARR_URL || 'http://localhost:8080/api/index.php';

const ADMIN_STORAGE_KEY = 'donjose_admin_api_key';

export const getAdminApiKey = (): string => {
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setAdminApiKey = (key: string): void => {
  try {
    if (key) localStorage.setItem(ADMIN_STORAGE_KEY, key.trim());
    else localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {
    /* navegador sin almacenamiento disponible */
  }
};

const createDolibarrClient = (getKey: () => string): AxiosInstance => {
  const client = axios.create({
    baseURL: DOLIBARR_BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Inyecta la API key en cada petición
  client.interceptors.request.use((config) => {
    const key = getKey();
    if (key) config.headers.DOLAPIKEY = key;
    return config;
  });

  return client;
};

export const tiendaClient = createDolibarrClient(
  () => import.meta.env.VITE_DOLIBARR_API_KEY || ''
);

export const adminClient = createDolibarrClient(getAdminApiKey);

/** Normaliza los mensajes de error que devuelve Dolibarr. */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isCancel(error)) return 'Petición cancelada';
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: { message?: string }; message?: string }
      | undefined;
    if (!error.response) {
      return 'No se pudo conectar con Dolibarr. ¿Está encendido Docker y la URL es correcta?';
    }
    if (error.response.status === 401) {
      return 'La API key de Dolibarr no es válida o no tiene permisos.';
    }
    return data?.error?.message || data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido al comunicarse con Dolibarr';
};
