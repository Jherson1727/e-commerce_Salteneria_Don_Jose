import { createContext, useContext, useState, type ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/dolibarrClient';
import { guardarSesion, leerSesion, type Rol, type Sesion } from '../services/sesion';

/**
 * Autenticación del panel de administración con Context API.
 * La sesión es un único estado inmutable: al iniciar sesión se crea un objeto
 * nuevo y al cerrarla se reemplaza por null. Los datos derivados (rol, esAdmin,
 * isAutenticated) se calculan del estado, así nunca quedan desincronizados.
 */
interface ResultadoLogin {
  success: boolean;
  message?: string;
}

interface AuthContextValue {
  user: Sesion['user'] | null;
  token: string | null;
  rol: Rol | null;
  isAutenticated: boolean;
  esAdmin: boolean;
  login: (datos: { login: string; password: string }) => Promise<ResultadoLogin>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

const mensajeLogin = (error: unknown, etapa: string): string => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (etapa === 'login' && (status === 401 || status === 403)) {
    return 'Usuario o contraseña incorrectos.';
  }
  // Dolibarr solo deja leer /users/info a quien tiene permisos sobre usuarios
  if (etapa === 'info' && (status === 401 || status === 403)) {
    return 'Tu usuario no tiene permisos de administrador.';
  }
  if (status === undefined) return 'No se pudo conectar con el servidor. Intenta de nuevo.';
  if (status === 429) return 'Demasiados intentos. Espera un minuto.';
  return `No se pudo iniciar sesión (paso: ${etapa}, código ${status}).`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion);

  const login: AuthContextValue['login'] = async ({ login: usuario, password }) => {
    let etapa = 'login';
    try {
      // 1. Usuario y contraseña → token del usuario en Dolibarr
      const { data } = await api.post('/login', { login: usuario, password });
      const token: string | undefined = data?.success?.token;
      if (!token) return { success: false, message: 'Dolibarr no devolvió un token.' };

      // 2. Datos del usuario con ese token
      etapa = 'info';
      const { data: info } = await api.get('/users/info', { headers: { DOLAPIKEY: token } });
      const rol: Rol = String(info?.admin) === '1' ? 'admin' : 'usuario';
      const nombre = [info?.firstname, info?.lastname].filter(Boolean).join(' ') || info?.login || usuario;

      const nueva: Sesion = {
        token,
        user: { id: Number(info?.id), login: info?.login ?? usuario, nombre, rol },
      };
      guardarSesion(nueva);
      setSesion(nueva);
      return { success: true };
    } catch (error) {
      return { success: false, message: mensajeLogin(error, etapa) };
    }
  };

  const logout = () => {
    guardarSesion(null);
    setSesion(null);
  };

  const rol = sesion?.user?.rol ?? null;
  const contextValue: AuthContextValue = {
    user: sesion?.user ?? null,
    token: sesion?.token ?? null,
    rol,
    isAutenticated: !!sesion?.token,
    esAdmin: rol === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
