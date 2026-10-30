import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Inicio de sesión del administrador con su usuario y contraseña de Dolibarr. */
const Login = () => {
  const { login, isAutenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const volver: string = (location.state as { volver?: string } | null)?.volver ?? '/admin';

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  if (isAutenticated) return <Navigate to={volver} replace />;

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !password) {
      setError('Escribe tu usuario y tu contraseña.');
      return;
    }
    setCargando(true);
    setError(null);
    const resultado = await login({ login: usuario.trim(), password });
    setCargando(false);
    if (resultado.success) navigate(volver, { replace: true });
    else setError(resultado.message ?? 'No se pudo iniciar sesión.');
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-donjose-brown">
      <form onSubmit={enviar} className="bg-white w-full max-w-sm rounded-lg shadow p-8 space-y-5" noValidate>
        <div>
          <h1 className="text-2xl font-bold">Panel de administración</h1>
          <p className="text-sm text-gray-600">Salteñería Don José · ingresa con tu usuario de Dolibarr</p>
        </div>

        <label className="block text-sm font-medium">
          Usuario
          <input
            type="text"
            autoComplete="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </label>

        <label className="block text-sm font-medium">
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border-l-4 border-red-500 p-3 rounded">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <a href="/" className="block text-center text-sm font-bold text-donjose-orange hover:underline">
          ← Volver a la tienda
        </a>
      </form>
    </main>
  );
};

export default Login;
