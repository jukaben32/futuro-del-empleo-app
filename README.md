# Futuro del Empleo en la Era de IA

Plataforma interactiva sobre el impacto de la IA en el mercado laboral (2025-2030), basada en el WEF Future of Jobs Report 2025. React + Vite + Tailwind, desplegada en Vercel.

**Producción:** https://futuro-del-empleo-app.vercel.app

---

## Ruta de desarrollo

### ✅ Fase 0 — Reporte interactivo (completada)

La base del proyecto: los datos del WEF convertidos en secciones navegables.

| Sección | Componente | Qué hace |
|---|---|---|
| 1. Métricas clave | `HeroStats` | Cifras WEF 2025-2030, filtrables por sector y región |
| 2. Empleos en alza vs. caída | `JobsComparison` | Top 5 de cada lado, con salto al comparador |
| 3. Habilidades del futuro | `FutureSkills` | Ranking de competencias más demandadas |
| 4. Simulador de rol | `RoleSimulator` | Diagnóstico de automatización sobre roles predefinidos |
| 5. Comparador 1 a 1 | `HeadToHeadComparator` | Enfrenta dos puestos y contrasta su futuro |
| 6. Plan de reskilling | `ReskillingRoadmap` | Rutas de transición hacia roles con futuro |
| 7. Calculadora de ROI | `RoiCalculator` | Retorno estimado de invertir en formación |

Los datos viven en [`src/data/futureJobsData.js`](src/data/futureJobsData.js) (~735 líneas). No hay base de datos detrás de esta fase: todo es estático.

### ✅ Fase 1 — Acceso y predictor con IA (completada)

- **Puerta de entrada por enlace mágico.** `App.jsx` no renderiza nada hasta que hay sesión de Supabase. Sin contraseñas: se pide el correo y llega un enlace de un solo uso.
- **Predictor de rol con IA.** `AIRolePredictor` acepta *cualquier* puesto escrito a mano y llama a [`api/predict-role.js`](api/predict-role.js), que consulta a `google/gemini-2.5-flash-lite` vía OpenRouter y devuelve un diagnóstico estructurado (score de automatización, qué hará la IA, qué seguirá siendo humano, ruta de transición sugerida).
- **Plan de reskilling a medida.** El simulador curado (9 roles fijos) sigue usando las 3 rutas fijas de `RESKILLING_PATHS`. Pero el predictor de IA ya no encaja cualquier profesión en una de esas 3 casillas: [`api/generate-roadmap.js`](api/generate-roadmap.js) genera un plan de 3 fases *específico* al puesto diagnosticado (herramientas, cursos y duración propios de ese sector), y se muestra como una 4ª pestaña morada junto a las curadas.
- **Defensas de ambos endpoints:** exigen token de sesión válido, validan la respuesta del modelo con Zod, reintentan una vez si el modelo devuelve algo malformado, cachean por `(puesto, país)` y comparten un límite de 10 generaciones de IA diarias por usuario (diagnóstico + roadmap cuentan para el mismo cupo).

### 🔜 Fase 2 — Que la app recuerde al usuario

Hoy la sesión persiste, pero **nada de lo que hace el usuario se guarda**: si recarga la página, pierde su diagnóstico. Esta fase convierte la app de "reporte" en "herramienta personal".

- [ ] Guardar el historial de diagnósticos de cada usuario y mostrarlo al volver
- [ ] Perfil mínimo: puesto actual y país, para no repreguntarlos en cada visita
- [ ] Marcar pasos completados en el plan de reskilling (progreso persistente)
- [ ] Exportar el diagnóstico a PDF o enlace compartible

Requiere tablas nuevas **con políticas de Row Level Security**, porque a diferencia de las actuales estas sí se leerían desde el navegador.

### 🔜 Fase 3 — Abrir la app al público

Ahora mismo la app **solo puede recibir a miembros del proyecto de Supabase** (ver *Envío de correos*). Antes de compartirla con cualquiera:

- [ ] **Dominio propio verificado en Resend** — bloqueante, sin esto no llegan los correos
- [ ] Página de aterrizaje pública, antes del login, que explique qué es la app
- [ ] Analítica para saber qué secciones se usan de verdad
- [x] Cabeceras de seguridad — hecho en [`vercel.json`](vercel.json)

### 💡 Fase 4 — Ideas sin comprometer

Anotadas para no perderlas, no priorizadas: comparar tu rol contra el promedio de tu sector, alertas por correo cuando cambien los datos del WEF, versión en inglés.

---

## Estado de los pendientes

| Qué | Estado |
|---|---|
| Tablas `role_predictions`, `usage_daily` y `reskilling_roadmaps` | ✅ Creadas, con RLS activado y sin políticas (solo el service role entra) |
| Cabeceras de seguridad | ✅ [`vercel.json`](vercel.json) con CSP, HSTS, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy` |
| Error boundary de React | ✅ [`ErrorBoundary`](src/components/ErrorBoundary.jsx) envuelve la app en `main.jsx` |
| Tests | ✅ Vitest, 28 tests sobre la lógica pura |
| Roadmap de reskilling genérico para profesiones fuera de las 9 curadas | ✅ Ahora se genera a medida, ver [`api/generate-roadmap.js`](api/generate-roadmap.js) |
| **SMTP de producción** | ⏳ **Pendiente y bloqueante para la Fase 3** — requiere un dominio propio verificado en Resend |

### Sobre la CSP

La directiva `connect-src` de [`vercel.json`](vercel.json) **lleva la URL de Supabase escrita a mano**. Si algún día cambias de proyecto de Supabase, hay que actualizarla ahí también, o el login dejará de funcionar en producción: el navegador bloqueará las llamadas sin mostrar nada en la interfaz, solo un error en la consola.

### Sobre el roadmap de reskilling generado por IA

Hay **dos caminos distintos** hacia la sección "Plan de Reskilling", y es importante no confundirlos:

- **Simulador curado** (los 9 roles predefinidos de `RoleSimulator`): siempre usa una de las **3 rutas fijas** de `RESKILLING_PATHS` (`src/data/futureJobsData.js`), escritas a mano. Instantáneo, sin costo de IA.
- **Predictor de texto libre** (`AIRolePredictor`): al pulsar "Ver Plan de Reskilling", llama a [`api/generate-roadmap.js`](api/generate-roadmap.js), que le pide al LLM un plan de 3 fases *específico* a esa profesión — no una de las 3 rutas fijas. Tarda unos segundos (llamada real al modelo) y se cachea por `(puesto, país)` en la tabla `reskilling_roadmaps`, igual que el diagnóstico.

El roadmap generado se agrega como una **4ª pestaña morada**, sin reemplazar las 3 curadas — así el usuario puede seguir comparando. `api/generate-roadmap.js` nunca confía en el `targetRole` que mandaría el navegador: siempre relee el diagnóstico ya cacheado en `role_predictions` para ese `(puesto, país)` y construye el prompt desde ahí.

**El límite diario (10) se comparte entre diagnóstico y roadmap** — generar ambos para una misma profesión gasta 2 de esas 10 acciones. Es una decisión deliberada de simplicidad (un solo contador, una sola tabla `usage_daily`) y no un límite por feature.

### Qué cubren los tests

```bash
npm test            # una pasada
npm run test:watch  # modo continuo mientras desarrollas
```

Cubren la lógica pura, que es donde un fallo silencioso hace más daño:

- **`getScoreColor`** — los umbrales de color (40 / 70) deben coincidir con los que el prompt le pide al LLM.
- **`getFriendlyAuthError`** — traducción de los errores de Supabase Auth a mensajes accionables.
- **`normalizeTitle`** — si falla, `"Contador"` y `"contador "` se cachean por separado y la caché deja de ahorrar dinero.
- **`rolePredictionSchema`** — la validación que impide que una respuesta malformada del LLM llegue a la interfaz.
- **`reskillingRoadmapSchema`** — exige exactamente 3 fases numeradas 1, 2 y 3 sin repetir; si el modelo las numera mal, dos fases colisionarían en la misma clave de la UI y una desaparecería del render sin aviso.

No hay tests de componentes React todavía: para una app tan visual, la regresión visual daría más señal que afirmar sobre el marcado.

---

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

Proyecto: `ydajpvyrcysjfpzyvqnm` (*el futuro del empleo app*).

### URLs de redirección — ya configuradas

En **Authentication → URL Configuration**:

- **Site URL:** `https://futuro-del-empleo-app.vercel.app`
- **Redirect URLs:**
  - `https://futuro-del-empleo-app.vercel.app/**`
  - `https://futuro-del-empleo-app-*-juans-projects-0e0054fc.vercel.app/**` (previews)
  - `http://localhost:5173/**` (`npm run dev`)
  - `http://localhost:3000/**` (`vercel dev`)

> **Por qué importa:** si una URL no está en esa lista, Supabase la descarta en silencio y redirige al **Site URL**. Con la lista vacía y el Site URL en `http://localhost:3000` (el valor por defecto), el enlace mágico se validaba correctamente y luego mandaba al usuario a una dirección local donde no hay nada. El login parecía roto sin estarlo.

El enlace mágico debe abrirse en el mismo navegador donde se pidió el correo.

### Envío de correos — limitado

Actualmente se usa el **servicio de correo interno de Supabase**, con dos límites duros:

- máximo **2 correos por hora**
- solo llegan a direcciones que sean **miembros de la organización de Supabase**

Sirve para desarrollo. Para abrir la app al público hay que configurar SMTP propio en **Authentication → Emails → SMTP Settings**.

> **Si usas Resend:** el remitente debe pertenecer a un dominio **tuyo y verificado** en [resend.com/domains](https://resend.com/domains). Un remitente `@gmail.com` es rechazado siempre con `550 domain is not verified`, sin importar qué clave API pongas — Gmail no es un dominio que puedas verificar como propio.
>
> Cuidado al editar el SMTP por API: Supabase trata ese bloque como un conjunto, así que enviar un solo campo borra el resto de la configuración.

### Base de datos

El SQL de [`supabase/schema.sql`](supabase/schema.sql) **ya está aplicado** en el proyecto. Si algún día levantas el proyecto desde cero, ejecuta ese archivo **completo y de una sola vez** en el SQL Editor: los `alter table ... enable row level security` del final fallan con `relation does not exist` si se ejecutan sueltos, antes de los `create table`.

### Diagnosticar problemas de login

Los logs de autenticación (**Logs → Auth**) dicen exactamente qué pasó. Dos campos clave:

- `error` — el motivo real del fallo (por ejemplo, el rechazo del servidor SMTP)
- `referer` — a dónde redirigió Supabase de verdad. Si no coincide con tu app, la URL no está en la lista de redirección.

## Stack

- React 19 + Vite + Tailwind CSS
- Supabase (autenticación por magic link)
- OpenRouter (`google/gemini-2.5-flash-lite`) para el predictor de empleo con IA
- Vitest para los tests
- Desplegado en Vercel
