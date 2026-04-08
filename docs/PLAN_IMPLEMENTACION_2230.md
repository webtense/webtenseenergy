# Plan de implementacion (ventana 22:30)

Este plan define la ejecucion por fases para migrar a Postgres en EasyPanel y construir el nuevo backoffice con blog, newsletter, Telegram e IA (OpenRouter free), manteniendo la web estable.

## Objetivos

- Migrar de SQLite a Postgres en EasyPanel con rollback controlado.
- Crear backoffice en la app actual (Next.js + Prisma).
- Permitir edicion de textos y modulos activables/desactivables.
- Soportar idiomas castellano y catalan.
- Reducir el banner principal un 25%.
- Asegurar que las solicitudes de estudio adjunten factura cuando exista.
- Implementar newsletter interna con programacion diaria/semanal/mensual.
- Integrar Telegram Deals con bot + webhook.
- Incluir ayudas de IA via OpenRouter free con fallback manual.

## Alcance funcional

- Backoffice en `/admin` con auth y roles.
- Feature flags para `blog`, `ofertas`, `newsletter`, `telegram`.
- Gestion integral de blog: borrador, revision, programado, publicado, SEO, categorias y tags.
- Formularios con trazabilidad de envio y reintentos.
- Newsletter por lotes con editor por bloques.
- Integracion Telegram con logs de entrega.

## Fuera de alcance inicial

- Automatizaciones complejas de marketing (journeys avanzados).
- Segmentacion predictiva con IA.
- Migracion a multi-tenant.

## Arquitectura objetivo

- App unica: Next.js (frontend + API routes) + Prisma + Postgres.
- Cola de envios simple basada en jobs en BD (sin broker externo en fase inicial).
- Servicios externos:
  - SMTP (envio correo)
  - OpenRouter free (asistencia IA)
  - Telegram Bot API (deals)

## Modelo de datos (resumen)

- `AdminUser`, `Role`
- `FeatureFlag`, `SiteSetting`, `Translation`
- `Post`, `PostTranslation`, `Category`, `Tag`
- `Lead`, `StudyRequest`, `Attachment`, `EmailLog`
- `Subscriber`, `Consent`, `Campaign`, `CampaignBlock`, `CampaignSchedule`, `SendJob`, `SendEvent`
- `TelegramConfig`, `TelegramDeal`, `TelegramLog`

## Variables de entorno nuevas

- `DATABASE_URL` (Postgres)
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_BASE_URL=https://openrouter.ai/api/v1`
- `OPENROUTER_TIMEOUT_MS=15000`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `NEWSLETTER_SENDER_NAME`
- `NEWSLETTER_REPLY_TO`

## Plan por fases

### Fase 0 - Seguridad y preparacion

1. Rotar credenciales expuestas (SSH, EasyPanel, OpenRouter, SMTP).
2. Guardar secretos solo en EasyPanel, nunca en archivos versionados.
3. Tomar backup de la base SQLite actual.

### Fase 1 - Postgres en EasyPanel

1. Crear servicio Postgres con volumen persistente.
2. Crear usuario y base de datos de aplicacion.
3. Probar conectividad desde la app.

### Fase 2 - Prisma y migracion de datos

1. Cambiar datasource Prisma a `postgresql`.
2. Crear y aplicar migraciones base.
3. Ejecutar seed inicial:
   - Admin inicial
   - Feature flags base
   - Import de posts existentes

### Fase 3 - Backoffice base

1. Implementar `/admin` con login y roles.
2. Gestion de textos globales de home.
3. Activacion/desactivacion de modulos por feature flags.
4. Reducir hero principal un 25% en desktop y movil.

### Fase 4 - i18n ES/CA

1. Crear estructura de traducciones por entidad.
2. Selector de idioma con fallback a ES.
3. Contenido editable por idioma desde backoffice.

### Fase 5 - Formularios y correo robusto

1. Refactor `contacto` y `estudio` con logs.
2. Migrar `estudio` a `multipart/form-data`.
3. Adjuntar factura si el usuario sube archivo.
4. Reintentos y registro de fallos de correo.

### Fase 6 - Blog integral

1. CRUD completo de posts.
2. Flujo editorial `draft -> review -> scheduled -> published`.
3. SEO por post y preview.

### Fase 7 - Newsletter interna

1. Alta/baja de suscriptores + consentimiento.
2. Editor de bloques (texto, imagen, boton, separador).
3. Campanas diarias, semanales y mensuales.
4. Envio por lotes y metricas base.

### Fase 8 - Telegram + IA

1. Publicar deals desde backoffice a canal Telegram.
2. Webhook seguro con `secret token`.
3. IA OpenRouter para sugerencias de asunto, preheader, CTA y variantes.
4. Fallback manual cuando IA no responda o no haya cuota.

## Runbook ventana 22:30

### 22:30-22:35

- Verificar backups, variables y estado de servicios.

### 22:35-22:45

- Crear Postgres y confirmar conectividad.

### 22:45-22:55

- Ejecutar migraciones Prisma + seed base.

### 22:55-23:05

- Importar contenido actual (posts/ofertas si aplica).

### 23:05-23:15

- Deploy de la app con configuracion nueva.

### 23:15-23:35

- Validaciones: home, blog, contacto, estudio con adjunto.

### 23:35-23:45

- Validaciones newsletter: alta + test envio + programacion.

### 23:45-23:55

- Validaciones Telegram: webhook y deal de prueba.

### 23:55-00:00

- Cierre, evidencias y checklist final.

## Criterios de aceptacion

- La app funciona en dominio principal sin errores 5xx.
- Postgres operativo y Prisma migrado.
- Backoffice accesible y protegido por login.
- Banner principal reducido 25%.
- Idiomas ES/CA visibles y editables.
- En `estudio`, la factura se envia adjunta cuando existe.
- Newsletter permite programar y enviar.
- Telegram publica deals correctamente.

## Riesgos y mitigaciones

- Riesgo: corte por migracion DB.
  - Mitigacion: backup previo + rollback rapido por `DATABASE_URL`.
- Riesgo: cuota IA gratuita inestable.
  - Mitigacion: fallback manual y cache de sugerencias.
- Riesgo: entregabilidad SMTP.
  - Mitigacion: logging, reintentos y monitor de rebotes basico.

## Rollback

1. Revertir `DATABASE_URL` a origen temporal (SQLite) si hay bloqueo critico.
2. Re-desplegar imagen estable anterior.
3. Validar home, contacto y estudio.
4. Reprogramar ventana y analizar causa.

## Estado

- Plan definido y listo para ejecucion en la ventana de las 22:30.
