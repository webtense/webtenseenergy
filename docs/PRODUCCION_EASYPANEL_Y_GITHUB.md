# Produccion segura en EasyPanel y GitHub

## 1. Seguridad inmediata

- Rotar el token de GitHub que estuvo expuesto en la URL del remoto.
- Cambiar tambien cualquier secreto que haya vivido en `easypanel.json` o capturas del panel.
- Mantener `origin` sin credenciales embebidas: `https://github.com/webtense/webtenseenergy.git`.

## 2. GitHub

- El workflow `.github/workflows/docker.yml` construye y publica la imagen en GHCR al hacer push a `main`.
- Repositorio esperado de imagen: `ghcr.io/webtense/webtenseenergy/webtense-energy:latest`.
- No guardes tokens en el remoto ni en scripts de despliegue.

## 3. EasyPanel

Configura el servicio Docker usando la imagen de GHCR y estas variables en el panel:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `NEXT_PUBLIC_WHATSAPP`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `AMAZON_AFFILIATE_TAG`
- `OPENROUTER_API_KEY` (opcional)

## 4. Base de datos

- El proyecto usa Postgres con Prisma.
- Antes del primer deploy productivo ejecuta:

```bash
npx prisma db push
npm run db:seed-admin
```

- Si quieres trazabilidad completa de cambios, el siguiente paso recomendable es generar migraciones Prisma versionadas.

## 5. Flujo recomendado

1. Push a `main`.
2. GitHub publica la imagen en GHCR.
3. EasyPanel hace `Deploy latest`.
4. Validar `/`, `/blog`, `/admin/login`, creación de borrador Telegram y publicación manual.

## 6. Observaciones

- El flujo de ofertas ahora es `borrador + revision`.
- Cada oferta pegada crea:
  - un borrador de Telegram en admin
  - un post en estado `REVIEW` dentro del gestor de blog
- La publicación en Telegram requiere `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHANNEL_ID` válidos.
