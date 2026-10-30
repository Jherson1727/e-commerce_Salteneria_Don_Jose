/**
 * Función del servidor (Vercel) que hace de intermediaria entre la tienda y Dolibarr.
 *
 * - La URL de Dolibarr y la clave del usuario de servicio "ecommerce" se leen con
 *   process.env en el servidor: nunca llegan al navegador.
 * - Solo deja pasar los recursos y métodos que usa la tienda (lista blanca).
 * - Crear, modificar o eliminar productos exige el token del administrador
 *   (encabezado DOLAPIKEY de la sesión); sin él responde 403.
 * - Limita la cantidad de peticiones por dirección IP.
 *
 * En desarrollo, vite.config.ts usa esta misma función, así que el comportamiento
 * es igual en localhost y en Vercel.
 */

// Reglas: recurso (expresión regular) → métodos permitidos y si exigen token de usuario
const REGLAS = [
  { patron: /^login$/, metodos: ['POST'], publico: true },
  { patron: /^users\/info$/, metodos: ['GET'], token: true },
  { patron: /^products$/, metodos: ['GET'] },
  { patron: /^products$/, metodos: ['POST'], token: true },
  { patron: /^products\/\d+$/, metodos: ['GET'] },
  { patron: /^products\/\d+$/, metodos: ['PUT', 'DELETE'], token: true },
  { patron: /^products\/ref\/[\w-]+$/, metodos: ['GET'] },
  { patron: /^warehouses$/, metodos: ['GET'] },
  { patron: /^bankaccounts$/, metodos: ['GET'] },
  { patron: /^setup\/dictionary\/payment_types$/, metodos: ['GET'] },
  { patron: /^thirdparties$/, metodos: ['GET', 'POST'] },
  { patron: /^invoices$/, metodos: ['POST'] },
  { patron: /^invoices\/\d+\/validate$/, metodos: ['POST'] },
  { patron: /^invoices\/\d+\/payments$/, metodos: ['POST'] },
];

const LIMITE_POR_MINUTO = 60;
const contadores = new Map(); // ip → { inicio, total }

const superaLimite = (ip) => {
  const ahora = Date.now();
  const actual = contadores.get(ip);
  if (!actual || ahora - actual.inicio > 60_000) {
    contadores.set(ip, { inicio: ahora, total: 1 });
    return false;
  }
  actual.total += 1;
  return actual.total > LIMITE_POR_MINUTO;
};

const responder = (res, status, mensaje) =>
  res.status(status).json({ error: { code: status, message: mensaje } });

export default async function handler(req, res) {
  const baseDolibarr = (process.env.DOLIBARR_URL || '').trim().replace(/\/+$/, '');
  const keyServicio = (process.env.DOLIBARR_API_KEY || '').trim();
  if (!baseDolibarr || !keyServicio) {
    return responder(res, 500, 'Faltan las variables DOLIBARR_URL o DOLIBARR_API_KEY en el servidor.');
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local')
    .split(',')[0]
    .trim();
  if (superaLimite(ip)) {
    return responder(res, 429, 'Demasiadas peticiones. Espera un momento e intenta de nuevo.');
  }

  // "ruta" llega desde la reescritura de vercel.json: /api/products → ruta=products
  const rutaCruda = Array.isArray(req.query.ruta) ? req.query.ruta.join('/') : String(req.query.ruta || '');
  const ruta = rutaCruda.replace(/^\/+|\/+$/g, '');
  const metodo = String(req.method || 'GET').toUpperCase();

  const regla = REGLAS.find((r) => r.patron.test(ruta) && r.metodos.includes(metodo));
  if (!regla) {
    return responder(res, 403, `Recurso no permitido: ${metodo} /${ruta}`);
  }

  const tokenUsuario = String(req.headers.dolapikey || '').trim();
  if (regla.token && !tokenUsuario) {
    return responder(res, 403, 'Esta operación requiere iniciar sesión como administrador.');
  }

  // Parámetros de consulta (sqlfilters, limit, etc.), sin el parámetro interno "ruta"
  const params = new URLSearchParams();
  Object.entries(req.query || {}).forEach(([clave, valor]) => {
    if (clave === 'ruta') return;
    (Array.isArray(valor) ? valor : [valor]).forEach((v) => params.append(clave, String(v)));
  });
  const consulta = params.toString();
  const destino = `${baseDolibarr}/api/index.php/${ruta}${consulta ? `?${consulta}` : ''}`;

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Evita la página de aviso de ngrok cuando Dolibarr se expone con un túnel
    'ngrok-skip-browser-warning': 'true',
  };
  if (!regla.publico) {
    headers.DOLAPIKEY = tokenUsuario || keyServicio;
  }

  let cuerpo;
  if (metodo !== 'GET' && metodo !== 'DELETE' && req.body !== undefined) {
    cuerpo = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const respuesta = await fetch(destino, { method: metodo, headers, body: cuerpo });
    const texto = await respuesta.text();
    res.status(respuesta.status);
    res.setHeader('Content-Type', respuesta.headers.get('content-type') || 'application/json');
    return res.send(texto);
  } catch (error) {
    return responder(res, 502, `No se pudo conectar con Dolibarr: ${error?.message ?? 'error desconocido'}`);
  }
}
