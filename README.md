# E-commerce Salteñería Don José

Tienda en línea (React + TypeScript + Vite + Tailwind) conectada a **Dolibarr ERP** por su API REST.

- El catálogo muestra **precio y stock reales** del almacén de venta **ALM-POS**.
- Al pagar (pago QR simulado), la venta **se registra en Dolibarr**: se crea una factura a nombre de
  nombre del **cliente real** (se busca por celular/NIT o se crea), se valida en **ALM-POS**
  (**descuenta el stock**) y se registra el **cobro** en la cuenta **BANCO-QR** (factura "Pagada").
- Rutas (react-router): `/` inicio y catálogo · `/producto/:ref` detalle del producto (ej. `/producto/SAL-01`)
  · `/login` inicio de sesión del administrador · `/admin` panel de productos, protegido por `RutaAdmin` (SDJ-39).

## Requisitos
1. Dolibarr corriendo (repo `erp-salteneria-don-jose`, `docker compose up -d` → `http://localhost:8080`).
2. En Dolibarr: módulo **API REST** activo, tercero **Cliente Web** (respaldo), cuenta bancaria **BANCO-QR**
   y usuario **ecommerce** con su **Clave para API**.

## Cómo correrlo
```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
# Edita .env.local: DOLIBARR_URL (sin /api/index.php) y DOLIBARR_API_KEY (usuario ecommerce)
npm run dev                  # abre http://localhost:5173
```

## Estructura de la conexión con Dolibarr
| Archivo | Qué hace |
| --- | --- |
| `api/dolibarr.js` | Función del servidor (Vercel y `npm run dev`): agrega la clave de servicio, lista blanca de recursos y límite por IP |
| `src/services/dolibarrClient.ts` | Clientes Axios hacia `/api`; el del panel envía el token de la sesión |
| `src/context/AuthContext.tsx` | Sesión del administrador (Context API, `useAuth`, `sessionStorage`) |
| `src/routes/RutaAdmin.tsx` | Componente envoltorio que protege `/admin` |
| `src/services/productosService.ts` | `GET /products` (en venta, con stock) y `GET /warehouses` (ALM-POS) |
| `src/services/ventasService.ts` | Cliente (`/thirdparties`), factura (`POST /invoices` + `/validate`, descuenta stock) y cobro (`POST /invoices/{id}/payments`) |
| `src/hooks/useProductos.ts` | Estado de carga / error / recarga del catálogo |

> La API key va en `.env.local` (no se sube a GitHub) y **sin prefijo `VITE_`**, para que no llegue al navegador.
> En Vercel se registran `DOLIBARR_URL` y `DOLIBARR_API_KEY` en *Settings → Environment Variables*.

## Despliegue en Vercel
`vercel.json` compila con `npm run build` (carpeta `dist`) y redirige `/api/*` a la función `api/dolibarr.js` y el resto a `index.html`.
Cada `git push` a la rama de producción publica una versión nueva.
