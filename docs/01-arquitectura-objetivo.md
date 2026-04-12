# Arquitectura Objetivo WebTenseEnergy v2.0

## Principios

- Monolito modular con `Next.js App Router`.
- GitHub como fuente de verdad.
- EasyPanel como runtime y destino de despliegue.
- PostgreSQL como persistencia oficial.
- Configuracion por variables de entorno; secretos fuera del repo.
- Cambios reproducibles desde Git, sin pasos manuales ocultos en produccion.

## Capas objetivo

### Capa publica

- `/`
- `/empresas`
- `/particulares`
- `/contacto`
- `/estudio`
- `/blog`
- `/blog/[slug]`
- `/ofertas`
- `/luz/precio-hoy`
- Variantes localizadas `/es/*` y `/ca/*`

### Capa privada

- `/admin/login`
- `/admin`
- `/admin/posts`
- `/admin/leads`
- `/admin/studies`
- `/admin/offers`
- `/admin/campaigns`
- `/admin/telegram`
- `/admin/settings`

### Capa backend

- `src/app/api/*` para BFF y endpoints publicos/privados
- `src/server/auth/*` para sesion, guards y RBAC
- `src/server/services/*` para logica de negocio
- `src/server/repositories/*` para acceso a datos y consultas persistentes
- `src/server/validators/*` para validacion de payloads
- `src/server/jobs/*` para tareas diferidas o programables

### Capa de datos

- `prisma/schema.prisma`
- `prisma/migrations/*`
- `scripts/seed-admin.mjs`
- futuros scripts de import/bootstrap versionados

### Capa operativa

- `.github/workflows/*`
- `Dockerfile`
- `easypanel.json`
- `docs/04-operacion-despliegue.md`
- `docs/05-runbook-backup-rollback.md`

## Estructura recomendada

```text
src/
  app/
    admin/
      login/
      (protected)/
        page.tsx
        posts/
        leads/
        studies/
        offers/
        campaigns/
        telegram/
        settings/
    api/
      contacto/
      estudio/
      precios-luz/
      newsletter/
      admin/
        auth/
        posts/
        leads/
        studies/
        offers/
        campaigns/
        telegram/
        settings/
    blog/
    contacto/
    empresas/
    estudio/
    luz/
    ofertas/
    page.tsx
  components/
    admin/
    layout/
    pages/
    shared/
    ui/
  server/
    auth/
    db/
    jobs/
    repositories/
    services/
    validators/
  lib/
    formatting/
    seo/
    security/
    constants/
prisma/
  schema.prisma
  migrations/
scripts/
docs/
```

## Convenciones de responsabilidad

### `src/app`

- Renderizado, routing, metadata y handlers HTTP.
- No debe contener logica de negocio extensa ni queries complejas repetidas.

### `src/components`

- Componentes UI y composicion de pantallas.
- Sin acceso directo a Prisma.

### `src/server`

- Fuente principal de logica de dominio.
- Orquesta validacion, reglas de negocio, persistencia y servicios externos.

### `src/lib`

- Utilidades transversales y helpers puros.
- Solo se mantiene aqui lo que no pertenece a un dominio concreto.

## Dominios funcionales objetivo

### Auth y admin

- Sesion admin segura con cookies `HttpOnly`
- Guards reutilizables por ruta y por API
- RBAC `ADMIN` y `EDITOR`
- Auditoria de acciones sensibles

### Leads y estudios

- Persistencia completa de formularios publicos
- Estados operativos y notas internas
- Logs de email y trazabilidad

### CMS editorial

- Posts, categorias, tags, traducciones, programacion y SEO
- Flujo editorial `DRAFT -> REVIEW -> SCHEDULED -> PUBLISHED -> ARCHIVED`
- Fallback legacy solo temporal mientras se completa la migracion

### Ofertas y Telegram

- Ofertas normalizadas en DB
- Flujo `draft -> review -> publish`
- Logs y reintentos basicos

### Newsletter y campañas

- Suscriptores y consentimiento
- Campañas con bloques
- Jobs de envio y eventos por suscriptor

### Energia

- Servicio de precio actual
- Persistencia de snapshots horarios
- Resumen diario
- Fallback controlado

## Flujo de despliegue objetivo

1. Cambio entra por `feature/*`.
2. Se integra en `develop` con validaciones CI.
3. Se despliega a staging.
4. `main` se publica a produccion con aprobacion manual.
5. EasyPanel despliega imagen o revision aprobada.
6. Las migraciones se aplican con paso controlado y documentado.

## Flujo de migracion desde el estado actual

### Etapa 1

- Mantener rutas publicas actuales sin romper.
- Mantener admin actual mientras se refactoriza internamente.
- Introducir `src/server/*` sin cambiar la UI de golpe.

### Etapa 2

- Mover logica de contacto, estudio, blog, telegram y energia a servicios.
- Aplicar repositorios y validadores tipados.

### Etapa 3

- Eliminar dependencias legacy de `src/data/posts.json` cuando DB cubra el flujo completo.
- Retirar scripts manuales obsoletos del camino principal de despliegue.

## Restricciones de arquitectura

- No introducir microservicios.
- No duplicar sistemas de auth.
- No mantener SQLite como via paralela.
- No escribir secretos en repo, scripts o docs.
- No depender de cambios manuales en servidor como fuente de verdad.

## Criterios de aceptacion de arquitectura

- Separacion clara UI / handlers / dominio / persistencia.
- Todas las funcionalidades clave caben en el monolito modular sin acoplamientos opacos.
- Produccion se puede reconstruir desde Git y variables del entorno.
- La base permite crecer sin rehacer el proyecto completo.
