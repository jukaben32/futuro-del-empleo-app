# Futuro del Empleo en la Era de IA

Plataforma interactiva sobre el impacto de la IA en el mercado laboral (2025-2030), basada en el WEF Future of Jobs Report 2025. React + Vite + Tailwind, desplegada en Vercel.

## Desarrollo local

```bash
npm install
npm run dev
```

**Importante:** el predictor de empleo con IA (`/api/predict-role`) es una función serverless de Vercel y **no corre** con `npm run dev` — Vite solo sirve el frontend. Para probar esa función localmente necesitas:

```bash
npm install -g vercel   # si no lo tienes
vercel dev
```

`vercel dev` sirve tanto el frontend como las funciones de `/api`, y lee las mismas variables de `.env.local`.

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores. Nunca se suben a git (`.env*` está en `.gitignore`).

| Variable | Dónde se usa | De dónde se obtiene |
|---|---|---|
| `VITE_SUPABASE_URL` | Cliente (login) y servidor (caché/límite de uso) | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Cliente (login) | Supabase → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor (`api/predict-role.js`) | Supabase → Project Settings → API → service_role key. **Nunca** le pongas el prefijo `VITE_` — eso la expondría en el navegador. |
| `OPENROUTER_API_KEY` | Solo servidor (`api/predict-role.js`) | [openrouter.ai/keys](https://openrouter.ai/keys) |

En producción/preview, estas mismas 4 variables se configuran en Vercel: **Project → Settings → Environment Variables**. Como Vite inyecta las variables `VITE_*` en tiempo de build, cualquier cambio requiere un nuevo deploy para tomar efecto.

## Configuración de Supabase

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **Authentication → URL Configuration**: Site URL = tu dominio de Vercel, y agrega `http://localhost:5173` a Redirect URLs (para probar el login en desarrollo).
3. Ejecuta el SQL de [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor del proyecto — crea las tablas de caché de predicciones y de límite de uso diario.

## Stack

- React 19 + Vite + Tailwind CSS
- Supabase (autenticación por magic link)
- OpenRouter (`google/gemini-2.5-flash-lite`) para el predictor de empleo con IA
- Desplegado en Vercel
