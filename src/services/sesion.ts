/**
 * Sesión del administrador guardada en sessionStorage: se conserva al recargar
 * o navegar y se borra al cerrar la pestaña. Las lecturas y escrituras van en
 * try/catch porque el almacenamiento puede no estar disponible (navegación privada).
 */
export type Rol = 'admin' | 'usuario';

export interface Sesion {
  token: string;
  user: { id: number; login: string; nombre: string; rol: Rol };
}

const SESSION_KEY = 'donjose_sesion';

export const leerSesion = (): Sesion | null => {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') as Sesion | null;
    return sesion?.token ? sesion : null;
  } catch {
    return null;
  }
};

export const guardarSesion = (sesion: Sesion | null): void => {
  try {
    if (sesion) sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* navegador sin almacenamiento disponible */
  }
};

export const getToken = (): string => leerSesion()?.token ?? '';
