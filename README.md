# WebTenseEnergy

WebTenseEnergy es una plataforma web en consolidacion orientada a captacion comercial, contenidos, estudio energetico, ofertas y backoffice editorial/operativo.

El repositorio actual ya corre sobre `Next.js 16` + `React 19` + `TypeScript 5` + `Prisma 7` + `PostgreSQL`, y se esta saneando para convertirlo en una base v2.0 mantenible y desplegable de forma reproducible en EasyPanel.

## Estado actual

- Runtime web: `Next.js 16 App Router`
- UI: `React 19`
- Persistencia: `PostgreSQL` via `Prisma 7` y `@prisma/adapter-pg`
- Auth admin actual: implementacion propia con `bcryptjs` y cookies `HttpOnly`
- Email: `nodemailer`
- Estilos: `Tailwind CSS 4`
- Deploy objetivo: `GitHub -> GHCR/EasyPanel`

## Modulos existentes

- Home comercial
- Paginas `empresas` y `particulares`
- Contacto
- Estudio energetico
- Blog
- Ofertas
- Precio de la luz
- Login admin y backoffice inicial
- Feature flags y ajustes de sitio
- Borradores Telegram para ofertas

## Documentacion oficial

La fuente activa de documentacion esta en `docs/`.

- `docs/00-auditoria-inicial.md`
- `docs/01-arquitectura-objetivo.md`
- `docs/06-decisiones-tecnicas.md`

La documentacion antigua en `DOC/` y snapshots sueltos puede contener referencias obsoletas y no debe usarse como fuente principal para decisiones nuevas.

## Variables de entorno

Usa `.env.example` como contrato de variables por nombre.

Variables clave actuales:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_SESSION_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `NEXT_PUBLIC_WHATSAPP`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `AMAZON_AFFILIATE_TAG`
- `OPENROUTER_API_KEY`
- `ESIOS_TOKEN`

No subas `.env` al repositorio.

## Desarrollo local

```bash
npm install
npm run db:generate
npm run dev
```

## Produccion

- La app usa `output: "standalone"`.
- El despliegue objetivo es mediante contenedor Docker y variables configuradas en EasyPanel.
- El flujo manual legado con `rsync`/`pm2` se considera obsoleto y se retirara del camino principal.

## Estado del roadmap

La prioridad inmediata es:

1. Auditar y ordenar el repo.
2. Consolidar esquema y migraciones Prisma.
3. Endurecer auth admin y RBAC.
4. Persistir leads, estudios y logs.
5. Completar CMS, ofertas, Telegram, newsletter y energia historica.

## Nota sobre v1.0

La estrategia de congelado aprobada es:

- rama `release/1.0`
- rama `archive/old-assets`
- tag `v1.0-baseline`

El tag definitivo sigue pendiente hasta resolver si el cambio local actual en `src/components/pages/OfertasPage.tsx` debe entrar en el baseline.
