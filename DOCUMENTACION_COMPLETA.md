# WEBTENSE ENERGY - Documentacion completa del proyecto

> Estado: documento obsoleto. No usar como fuente principal.
>
> La documentacion activa y canonica esta en `docs/`, empezando por:
> `docs/00-auditoria-inicial.md`, `docs/01-arquitectura-objetivo.md` y `docs/06-decisiones-tecnicas.md`.

## 1) Resumen del proyecto

WEBTENSE ENERGY es una app web hecha con Next.js (App Router) enfocada en:

- Consultoria energetica para empresas (`/empresas`)
- Servicios y ahorro para particulares (`/particulares`)
- Captacion de leads por formulario de contacto (`/contacto`)
- Captacion de leads por wizard de estudio energetico (`/estudio`)
- Blog con contenido importado desde WordPress (`/blog`, `/blog/[slug]`)
- Dashboard de precio de la luz por horas (`/luz/precio-hoy`)
- Pagina de ofertas y canal Telegram (`/ofertas`)

La app esta pensada para mercado ES (idioma, copy, formato de fecha, referencias energeticas).

## 2) Stack tecnico

- Framework: Next.js `16.2.0`
- UI: React `19.2.4`
- Lenguaje: TypeScript `5`
- Estilos: Tailwind CSS `4`
- Lint: ESLint `9` + `eslint-config-next`
- ORM: Prisma `7.6.0`
- DB por defecto: SQLite (via `DATABASE_URL`)
- Email: Nodemailer
- Auth (instalado): NextAuth v5 beta + @auth/core

## 3) Estructura de carpetas

```text
webtenseEnergy/
├─ prisma/
│  └─ schema.prisma
├─ scripts/
│  ├─ import_wp.js
│  ├─ parse-wp-xml.mjs
│  ├─ test-email.mjs
│  ├─ deploy.sh
│  ├─ deploy-vps.sh
│  └─ install-vps.sh
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ contacto/route.ts
│  │  │  ├─ estudio/route.ts
│  │  │  └─ precios-luz/route.ts
│  │  ├─ blog/page.tsx
│  │  ├─ blog/[slug]/page.tsx
│  │  ├─ contacto/page.tsx
│  │  ├─ empresas/page.tsx
│  │  ├─ estudio/page.tsx
│  │  ├─ luz/precio-hoy/page.tsx
│  │  ├─ ofertas/page.tsx
│  │  ├─ particulares/page.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ blog/ArticleCard.tsx
│  │  ├─ electricity/ElectricityDashboard.tsx
│  │  ├─ layout/{Header,Footer}.tsx
│  │  └─ ui/{EnergyAuditWizard,WhatsAppWidget}.tsx
│  ├─ data/posts.json
│  └─ lib/{posts.ts,electricity-api.ts}
├─ .env.example
├─ next.config.ts
├─ tsconfig.json
└─ package.json
```

## 4) Rutas funcionales

### Rutas de pagina

- `/` Home comercial
- `/empresas` Servicios B2B
- `/particulares` Servicios residencial
- `/estudio` Wizard multi paso para lead energetico
- `/contacto` Formulario de contacto
- `/blog` Listado de posts con filtro por categoria
- `/blog/[slug]` Detalle de articulo + metadata dinamica
- `/ofertas` Ofertas destacadas + CTA a Telegram
- `/luz/precio-hoy` Dashboard de precios por hora

### Rutas API

- `POST /api/contacto`
  - Recibe `name`, `email`, `phone`, `subject`, `message`
  - Valida campos obligatorios
  - Envia email por SMTP (o simula si no hay SMTP)

- `POST /api/estudio`
  - Recibe metodo (`upload`/`manual`), habitos y contacto
  - Formatea los habitos para email interno
  - Envia email por SMTP (o simula si no hay SMTP)

- `GET /api/precios-luz`
  - Consume API de REE/ESIOS
  - Construye estructura por franjas horarias
  - Aplica cache in-memory de 15 minutos
  - Devuelve min/max/media/actual + listado horario

## 5) Componentes clave

- `EnergyAuditWizard`
  - Flujo multi paso para capturar datos de consumo
  - Permite subida de archivo o consumo manual
  - Envia datos a `/api/estudio`

- `ElectricityDashboard`
  - Consume `getElectricityPrices()` de `src/lib/electricity-api.ts`
  - Muestra precio actual, media, minimo y maximo
  - Segmenta por manana/tarde/noche
  - Permite toggle de impuestos

- `WhatsAppWidget`
  - Boton flotante con aparicion diferida
  - Usa `NEXT_PUBLIC_WHATSAPP` o fallback fijo

## 6) Modelo de datos (Prisma)

En `prisma/schema.prisma` hay 3 modelos:

- `User`
  - `username` unico
  - `role` por defecto `EDITOR`
  - Relacion 1-N con `Post`

- `Post`
  - `slug` unico
  - Campos para contenido importado/publicado
  - Relacion opcional con `User`

- `Offer`
  - Estructura para ofertas con precio/categoria/url

Nota: actualmente el blog visible en frontend viene de `src/data/posts.json`, no de consultas Prisma en runtime.

## 7) Variables de entorno

Definidas en `.env.example`:

- `DATABASE_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `NEXT_PUBLIC_WHATSAPP`

Variable usada en API de luz (si se configura):

- `ESIOS_TOKEN`

## 8) Flujo funcional por modulo

### Contacto

1. Usuario envia formulario en `/contacto`.
2. Frontend hace `POST /api/contacto`.
3. API valida payload.
4. API envia correo (Nodemailer) o simula envio.
5. Frontend muestra exito/error.

### Estudio energetico

1. Usuario completa wizard en `/estudio`.
2. Frontend envia `POST /api/estudio`.
3. API compone correo con metodo y habitos.
4. API envia correo (o simula).
5. Wizard muestra estado final de envio.

### Precio de la luz

1. `ElectricityDashboard` llama a `/api/precios-luz`.
2. API consulta REE/ESIOS y normaliza datos.
3. Si falla API remota: usa cache si existe.
4. En cliente, si falla el endpoint: `lib/electricity-api.ts` usa fallback local de muestra.

### Blog

1. Posts se cargan desde `src/data/posts.json`.
2. `lib/posts.ts` filtra y expone utilidades.
3. `/blog` permite filtro por categoria.
4. `/blog/[slug]` genera rutas estaticas y metadata SEO.

## 9) Scripts de npm

En `package.json`:

- `npm run dev` - entorno local
- `npm run build` - build de produccion
- `npm run start` - servir build
- `npm run lint` - analisis ESLint

## 10) Scripts auxiliares

En `scripts/`:

- `import_wp.js`
  - Parseo de XML WordPress y salida a `src/data/posts.json`

- `parse-wp-xml.mjs`
  - Parseador alternativo para multiples XML

- `test-email.mjs`
  - Prueba de conectividad/envio SMTP

- `deploy.sh`, `deploy-vps.sh`, `install-vps.sh`
  - Scripts para despliegue manual/VPS

## 11) Configuracion de build

- `next.config.ts`
  - `output: "standalone"`
  - `images.remotePatterns` abierto a `https` con host wildcard

- `tsconfig.json`
  - Modo `strict: true`
  - Alias `@/* -> ./src/*`

- `eslint.config.mjs`
  - Reglas Next core web vitals + TS

## 12) Estado tecnico actual (validado)

Comandos ejecutados en este entorno:

- `npm run build` -> OK
- `npm run lint` -> con errores

Errores de lint detectados:

- `src/app/api/precios-luz/route.ts`
  - Uso de `any` en varias lineas (`@typescript-eslint/no-explicit-any`)

Warning detectado:

- `src/lib/electricity-api.ts`
  - parametro `_dateStr` no usado

## 13) Riesgos y mejoras recomendadas

- Seguridad
  - Implementar rate limiting en endpoints API
  - Evaluar proteccion CSRF para formularios
  - Revisar sanitizacion de HTML en contenido blog si entra desde fuentes externas

- Calidad tecnica
  - Eliminar `any` en `/api/precios-luz`
  - Añadir tests unitarios/integracion (no hay suite de tests declarada)
  - Mover ofertas hardcodeadas a fuente de datos (DB o CMS)

- Operacion
  - Revisar y rotar credenciales si alguna se ha expuesto en scripts de despliegue
  - Definir pipeline CI para lint/build automatizados

## 14) Puesta en marcha rapida

```bash
npm install
cp .env.example .env
npm run dev
```

Abrir `http://localhost:3000`.

## 15) Referencias de archivos clave

- `README.md`
- `package.json`
- `.env.example`
- `prisma/schema.prisma`
- `src/app/api/contacto/route.ts`
- `src/app/api/estudio/route.ts`
- `src/app/api/precios-luz/route.ts`
- `src/lib/posts.ts`
- `src/lib/electricity-api.ts`
- `src/components/ui/EnergyAuditWizard.tsx`
- `src/components/electricity/ElectricityDashboard.tsx`
