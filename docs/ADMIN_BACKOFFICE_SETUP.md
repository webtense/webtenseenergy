# Backoffice admin - puesta en marcha

## 1) Variables necesarias

- `DATABASE_URL` (Postgres en EasyPanel)
- `ADMIN_SESSION_SECRET` (cadena larga aleatoria)
- `ADMIN_EMAIL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## 2) Generar cliente Prisma

```bash
npm run db:generate
```

## 3) Crear/actualizar admin inicial

```bash
npm run db:seed-admin
```

## 4) Acceder al panel

- URL: `/admin/login`
- Modulos: `blog`, `ofertas`, `newsletter`, `telegram`
- Contenido editable inicial: titulo hero ES/CA

## 5) Endpoints admin incluidos

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET/PATCH /api/admin/feature-flags`
- `GET/PUT /api/admin/site-settings`
