# Auth Admin y RBAC

## Objetivo

Dotar al backoffice de una autenticacion admin realista, mantenible y compatible con el runtime actual, sin introducir una segunda pila de auth innecesaria.

## Implementacion actual

- Hash de password con `bcryptjs`
- Sesion firmada con HMAC en `src/lib/admin-auth.ts`
- Cookie `HttpOnly`, `SameSite=strict`, `secure` en produccion, prioridad alta
- Carga de usuario real desde BD en cada acceso protegido
- Auditoria minima de login/logout y acciones operativas

## Contrato de sesion

- Cookie: `ADMIN_SESSION_COOKIE_NAME` o fallback `wt_admin_session`
- Payload firmado:
  - `userId`
  - `username`
  - `role`
  - `exp`

La cookie no almacena datos sensibles adicionales ni reemplaza la comprobacion de usuario activo en base de datos.

## Roles

### `EDITOR`

- Puede acceder al backoffice protegido
- Puede gestionar contenidos
- Puede revisar leads y estudios
- Puede operar sobre borradores de Telegram y posts

### `ADMIN`

- Hereda permisos de `EDITOR`
- Puede gestionar `FeatureFlag`
- Puede gestionar `SiteSetting`
- Puede acceder a configuracion global y operaciones sensibles

## Puntos de enforcement

- `src/server/auth/admin.ts`
  - `getAuthenticatedAdmin()`
  - `requireAdminPageUser()`
  - `requireAdminApiUser()`
  - `hasRequiredRole()`

- `src/app/admin/(protected)/layout.tsx`
  - proteccion de rutas privadas

- APIs sensibles
  - `feature-flags` y `site-settings`: `ADMIN`
  - contenido y pipeline operativo: `EDITOR` o superior

## Auditoria

Se registra en `AuditLog` al menos:

- `admin_login`
- `admin_logout`
- `lead_updated`
- `study_updated`

## Variables necesarias

- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_COOKIE_NAME`
- `ADMIN_EMAIL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## Bootstrap inicial

```bash
npm run db:generate
npm run db:seed-admin
```

## Riesgos y limites actuales

- No hay 2FA en esta fase.
- La sesion es stateless firmada; no existe revocacion centralizada por tabla de sesiones.
- No se ha introducido Proxy para auth porque la proteccion real sigue ocurriendo en layout y API, que es donde importa la autorizacion final.
