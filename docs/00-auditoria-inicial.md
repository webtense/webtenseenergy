# Auditoria Inicial WebTenseEnergy

## Resumen ejecutivo

WebTenseEnergy ya no es una web corporativa simple. El repositorio actual contiene una base valida para una plataforma de captacion, contenidos, estudio energetico, ofertas y backoffice, pero esta en un estado hibrido: hay piezas productivas reales conviviendo con documentacion obsoleta, flujos manuales de despliegue y un modelo de datos mas ambicioso que la capa de aplicacion visible.

La prioridad correcta no es reescribir, sino consolidar. El stack base es adecuado para v2.0, pero antes de ampliar funcionalidad hay que cerrar deuda estructural: documentacion desalineada, migraciones Prisma inexistentes, persistencia incompleta en contacto/estudio, CI/CD insuficiente y un arbol de repo con legado pesado fuera del flujo operativo.

## Stack real detectado

- Framework: `Next.js 16.2.3` con App Router
- UI: `React 19.2.5`
- Lenguaje: `TypeScript 5`
- ORM: `Prisma 7.7.0`
- Driver DB: `@prisma/adapter-pg` + `pg`
- Base de datos objetivo: `PostgreSQL`
- Auth actual: implementacion propia con cookies `HttpOnly`, HMAC y `bcryptjs`
- Email: `nodemailer`
- Sanitizacion HTML: `sanitize-html`
- Estilos: `Tailwind CSS 4`
- Deploy actual valido: `Dockerfile` + `output: "standalone"`
- Runtime de destino: `EasyPanel` con TLS gestionado externamente

## Estructura real del repositorio

### Operativo hoy

- `src/app`: rutas publicas, admin y APIs
- `src/components`: UI publica, blog, layout y admin
- `src/lib`: acceso a DB, auth, seguridad, contenido, deals, SEO
- `prisma/schema.prisma`: modelo de datos real consolidado en Postgres
- `scripts/seed-admin.mjs`: seed admin compatible con Postgres
- `.github/workflows/docker.yml`: build y push Docker a GHCR
- `Dockerfile`: build standalone para Next.js
- `easypanel.json`: configuracion de runtime orientada a EasyPanel

### Legado / desalineado

- `DOC/`: documentacion duplicada y parcialmente incorrecta
- `DOCUMENTACION_COMPLETA.md`: snapshot obsoleto del estado tecnico
- `OLD/`: material historico pesado no operativo en el flujo actual
- `scripts/deploy.sh`, `scripts/deploy-vps.sh`, `scripts/install-vps.sh`: despliegue manual legado basado en `rsync`, `.env` remoto y `pm2`

## Modulos funcionales existentes

### Capa publica

- Home comercial
- Paginas `empresas` y `particulares`
- Formulario de contacto con envio SMTP y validaciones basicas
- Wizard de estudio energetico con upload y validacion de adjunto
- Blog publico con lectura desde DB y fallback a JSON legado
- Pagina de ofertas
- Dashboard publico de precio de la luz
- Rutas ES y CA para varias paginas publicas

### Capa privada

- Login admin (`/admin/login`)
- Dashboard admin protegido por sesion
- Gestion inicial de feature flags y site settings
- CRUD basico de posts
- Flujo de borrador de ofertas Telegram con publicacion manual

### Backend y seguridad

- `db.ts` usando Prisma + adapter Postgres
- Auth admin propia con cookie firmada
- Guardias de auth para API y layout protegido
- Rate limiting simple en memoria
- Normalizacion de email, escape HTML y control basico de origen
- Headers de seguridad y CSP definidos en `next.config.ts`

## Modelo de datos real detectado

El esquema Prisma ya contiene entidades suficientes para una plataforma mayor que la UI visible actual.

### Ya presentes en `prisma/schema.prisma`

- `AdminUser`
- `FeatureFlag`
- `SiteSetting`
- `Category`
- `Tag`
- `Post`
- `PostTranslation`
- `PostCategory`
- `PostTag`
- `Offer`
- `Lead`
- `StudyRequest`
- `EmailLog`
- `Subscriber`
- `Consent`
- `Campaign`
- `CampaignBlock`
- `SendJob`
- `SendEvent`
- `TelegramConfig`
- `TelegramDeal`
- `TelegramLog`

### Conclusiones sobre el modelo

- La direccion correcta ya es `PostgreSQL`, no SQLite.
- El esquema es una base razonable para v2.0, pero varias entidades aun no se usan plenamente en runtime.
- Faltan modelos o normalizacion para operacion real: `AuditLog`, estados de leads/estudios, historico de energia, notas operativas, plantillas email.
- No existen migraciones versionadas en `prisma/migrations`, lo que hoy impide una trazabilidad seria de cambios de esquema.

## Contradicciones encontradas entre documentacion y codigo

### Contradicciones graves

- `README.md` estaba desalineado con `SQLite` y `NextAuth`; se ha corregido en esta fase, pero el problema evidencia que la documentacion activa no estaba controlada.
- `DOCUMENTACION_COMPLETA.md` describe solo 3 modelos Prisma y un blog puramente JSON, lo cual ya no representa el repo actual.
- `DOC/DATABASE_SCHEMA.md` documenta campos y nombres que no coinciden con el schema real.
- `DOC/API_REFERENCE.md` describe respuestas, payloads y endpoints con formatos que ya no son exactos.
- `scripts/deploy*.sh` siguen modelando un despliegue manual con `.env` remoto, `rsync` y `pm2`, incompatible con el objetivo GitHub -> EasyPanel reproducible.

### Contradicciones moderadas

- El blog publico ya es DB-first con fallback a JSON, pero parte de la documentacion lo presenta como estatico.
- El panel admin existe y funciona, pero la documentacion lo presenta a veces como pendiente.
- La infraestructura apunta a EasyPanel + GHCR, pero la operacion documentada sigue mezclando VPS manual.

## Riesgos tecnicos

### Alto

- No hay migraciones Prisma versionadas.
- Contacto y estudio no persisten aun `Lead`, `StudyRequest` ni `EmailLog` pese a existir el modelo.
- El modulo de energia depende de cache en memoria y fallback local sin persistencia historica.
- No hay tests declarados ni suite de smoke/E2E para flujos criticos.
- El arbol activo incluye legado grande (`OLD/`) que distorsiona mantenimiento, busquedas y revisiones.

### Medio

- Auth admin valida sesion, pero RBAC aun no segmenta permisos por modulo de forma estricta.
- No hay middleware central de proteccion; la proteccion se reparte entre layouts y handlers.
- Rate limit en memoria no es adecuado para escalado horizontal.
- Telegram y newsletter existen de forma parcial, pero sin jobs ni trazabilidad completa extremo a extremo.

### Bajo

- El fallback del blog basado en JSON es util para migracion progresiva, pero debe tener fecha de salida.
- Hay documentacion valida mezclada con otra obsoleta; el riesgo es de confusion operativa mas que de fallo runtime inmediato.

## Riesgos operativos

- El congelado exacto de `v1.0` esta bloqueado ahora mismo por un cambio local sin commitear en `src/components/pages/OfertasPage.tsx`.
- El flujo principal de despliegue aun no esta completamente representado en CI/CD.
- Las variables de entorno estan presentes localmente, pero el repositorio aun no refleja una matriz limpia y actualizada por nombre.
- No hay runbook consolidado de backup, migraciones, validacion post-deploy y rollback.

## Compatibilidad real con produccion

### Compatible hoy

- Build standalone de Next.js
- Dockerfile funcional para contenedor Node
- Postgres via `DATABASE_URL`
- SMTP por variables
- Reverse proxy TLS en EasyPanel
- Imagen publica en GHCR

### Incompleto para produccion controlada

- Migraciones versionadas
- Checklist de despliegue por entornos
- Seed y bootstrap reproducibles dentro del flujo operativo
- Validaciones automatizadas previas al deploy
- Rollback documentado y testeable

## Compatibilidad real con EasyPanel

### Puntos positivos

- `Dockerfile` usa `output: "standalone"`
- `easypanel.json` ya modela el servicio, dominio y healthcheck
- La app escucha por variable `PORT` y expone `3010`
- El runtime usa variables de entorno, no secretos hardcodeados en el codigo

### Ajustes pendientes

- El flujo recomendado debe pasar a ser GitHub/GHCR -> EasyPanel, no scripts manuales
- Hay que documentar claramente variables obligatorias y opcionales en EasyPanel
- Hace falta separar proceso de migracion DB del arranque de contenedor

## Variables necesarias a reflejar en `.env.example`

### Confirmadas por codigo actual

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
- `NEXT_IMAGE_HOSTS`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_BASE_URL`
- `OPENROUTER_TIMEOUT_MS`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `AMAZON_AFFILIATE_TAG`
- `NEWSLETTER_SENDER_NAME`
- `NEWSLETTER_REPLY_TO`
- `ESIOS_TOKEN`
- `ADMIN_EMAIL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

### Recomendadas para v2.0

- `APP_ENV`
- `APP_BASE_URL`
- `LOG_LEVEL`
- `CRON_SECRET`
- `ADMIN_SESSION_COOKIE_NAME`

## Quick wins

- Alinear `README.md` con el stack real.
- Declarar `docs/` como fuente oficial de documentacion.
- Generar `docs/00`, `docs/01` y `docs/06` como base de decisiones.
- Limpiar `.env.example` para reflejar exactamente las variables vigentes.
- Crear ramas `develop`, `release/1.0` y `archive/old-assets`.
- Mover el contenido de `OLD/` fuera del flujo principal.

## Bloqueadores actuales

- Falta decidir si el cambio local de `OfertasPage.tsx` debe formar parte del congelado `v1.0`.
- No hay migraciones Prisma existentes, por lo que cualquier cambio de esquema requiere sentar primero la disciplina de migracion.
- No existe pipeline de calidad completo antes de hablar de despliegue continuo a produccion.

## Roadmap recomendado de ejecucion

1. Fase A: auditoria, arquitectura, saneado documental y estrategia repo.
2. Fase B: consolidacion de datos y migraciones Prisma.
3. Fase C: auth admin y RBAC reales.
4. Fase D: persistencia de leads, estudios y logs de email.
5. Fase E: CMS editorial completo y migracion progresiva del blog.
6. Fase F: ofertas y Telegram con trazabilidad.
7. Fase G: newsletter y campañas.
8. Fase H: historico energetico.
9. Fase I: CI/CD, hardening, operaciones y runbooks.

## Criterios de salida de la fase

- Documentacion base de auditoria creada.
- Arquitectura objetivo definida.
- Contradicciones principales identificadas y trazadas.
- Estrategia de ramas establecida.
- Bloqueos para congelado `v1.0` documentados explicitamente.
