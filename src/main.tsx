import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AdminApp from './admin/AdminApp.tsx'
import Login from './pages/Login.tsx'
import RutaAdmin from './routes/RutaAdmin.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* /login → inicio de sesión del administrador */}
          <Route path="/login" element={<Login />} />
          {/* /admin → panel de productos, protegido por RutaAdmin */}
          <Route
            path="/admin/*"
            element={
              <RutaAdmin>
                <AdminApp />
              </RutaAdmin>
            }
          />
          {/* cualquier otra ruta → tienda en línea (inicio y detalle de producto) */}
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
