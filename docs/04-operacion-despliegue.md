# Operacion y Despliegue

## Objetivo operativo

El flujo oficial es GitHub como fuente de verdad y EasyPanel como runtime. Quedan fuera del camino principal los despliegues por `rsync`, escritura manual de `.env` remoto y `pm2` improvisado.

## Flujo oficial

1. Desarrollo en `feature/*`
2. Integracion en `develop`
3. CI valida `lint`, `typecheck`, `db:generate` y `build`
4. `develop` publica imagen para staging
5. `main` publica imagen para produccion
6. EasyPanel despliega la imagen aprobada

## Workflows esperados

- `ci.yml`
  - lint
  - typecheck
  - prisma generate
  - build

- `docker.yml`
  - build y push a GHCR
  - ramas `develop` y `main`
  - tags por branch, sha y `latest` en `main`

## Variables en EasyPanel produccion

### Obligatorias

- `NODE_ENV=production`
- `APP_ENV=production`
- `PORT=3010`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `APP_BASE_URL`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_COOKIE_NAME`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `NEXT_PUBLIC_WHATSAPP`
- `AMAZON_AFFILIATE_TAG`

### Segun modulos activados

- `ESIOS_TOKEN`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_BASE_URL`
- `OPENROUTER_TIMEOUT_MS`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `NEWSLETTER_SENDER_NAME`
- `NEWSLETTER_REPLY_TO`
- `CRON_SECRET`

## Build y arranque

- Dockerfile compatible con `output: "standalone"`
- Puerto interno: `3010`
- Host runtime: `0.0.0.0`
- Reverse proxy y TLS gestionados por EasyPanel

## Preparacion inicial de entorno

1. Configurar variables en EasyPanel
2. Ejecutar migraciones Prisma
3. Ejecutar seed admin
4. Desplegar imagen publicada desde GitHub/GHCR
5. Validar rutas criticas

## Validacion post-deploy

- `/`
- `/blog`
- `/contacto`
- `/estudio`
- `/ofertas`
- `/luz/precio-hoy`
- `/admin/login`
- `GET /api/public/feature-flags`

## Scripts legacy

Los scripts `scripts/deploy.sh`, `scripts/deploy-vps.sh` y `scripts/install-vps.sh` se consideran solo referencia historica. No deben usarse como procedimiento principal de produccion.
