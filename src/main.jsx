import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envuelve toda la app: si algun componente lanza al renderizar,
        el usuario ve un mensaje util en vez de una pagina en blanco. */}
    <ErrorBoundary>
      <App />
      {/* No renderiza nada visible. Carga su script desde /_vercel/insights/
          (mismo origen que el sitio), asi que ya queda cubierto por la CSP
          existente (script-src/connect-src 'self') sin tocar vercel.json. */}
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
)
