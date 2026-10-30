import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * En desarrollo, las peticiones a /api/* pasan por la misma función del servidor
 * que usa Vercel (api/dolibarr.js), así la clave de Dolibarr tampoco llega al navegador.
 */
const apiDolibarrLocal = (): Plugin => ({
  name: 'api-dolibarr-local',
  configureServer(server) {
    server.middlewares.use('/api', async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url || '/', 'http://localhost')
      const query: Record<string, string> = Object.fromEntries(url.searchParams)
      query.ruta = url.pathname.replace(/^\/+/, '')

      const partes: Buffer[] = []
      for await (const parte of req) partes.push(parte as Buffer)
      const texto = Buffer.concat(partes).toString()

      const respuesta = Object.assign(res, {
        status(codigo: number) {
          res.statusCode = codigo
          return respuesta
        },
        json(datos: unknown) {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(datos))
          return respuesta
        },
        send(datos: string) {
          res.end(datos)
          return respuesta
        },
      })

      const modulo = await import(pathToFileURL(resolve('api/dolibarr.js')).href)
      await modulo.default(Object.assign(req, { query, body: texto || undefined }), respuesta)
    })
  },
})

export default defineConfig(({ mode }) => {
  // Variables sin prefijo VITE_: solo existen en el servidor de desarrollo, no en el navegador
  const env = loadEnv(mode, process.cwd(), '')
  process.env.DOLIBARR_URL = env.DOLIBARR_URL
  process.env.DOLIBARR_API_KEY = env.DOLIBARR_API_KEY

  return {
    plugins: [react(), apiDolibarrLocal()],
    server: {
      allowedHosts: true,
    },
  }
})
