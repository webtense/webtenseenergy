# Modelo de Datos Canonico

## Objetivo

El modelo de datos de WebTenseEnergy v2.0 se apoya en `PostgreSQL` y `Prisma` como unica fuente oficial de persistencia. No se mantiene ninguna via paralela basada en SQLite.

## Principios del modelo

- Entidades explicitas antes que payloads ambiguos.
- Estados operativos modelados en enums cuando forman parte del negocio.
- Indices en listados operativos y relaciones de consulta frecuente.
- Campos opcionales solo cuando reflejan una ausencia real de informacion.
- Relaciones con borrado coherente segun dependencia funcional.

## Entidades principales

### Admin y control

- `AdminUser`: usuarios internos con roles `ADMIN` y `EDITOR`.
- `FeatureFlag`: activacion de modulos publicos y privados.
- `SiteSetting`: ajustes simples editables por idioma.
- `AuditLog`: trazabilidad de acciones sensibles en backoffice.

### Editorial

- `Post`: entidad principal del contenido.
- `PostTranslation`: contenido por idioma.
- `Category`, `Tag`: taxonomias.
- `PostCategory`, `PostTag`: relaciones N:M.

### Comercial

- `Lead`: contactos comerciales persistidos.
- `LeadNote`: notas internas por lead.
- `StudyRequest`: solicitudes del estudio energetico.
- `EmailLog`: trazabilidad de correo saliente y fallos.

### Newsletter y campañas

- `Subscriber`: suscriptor principal.
- `Consent`: evidencia de consentimiento.
- `Campaign`: entidad cabecera de campaña.
- `CampaignBlock`: bloques de composicion.
- `SendJob`: ejecucion de envio.
- `SendEvent`: evento por suscriptor.

### Ofertas y Telegram

- `Offer`: catalogo de oferta gestionable.
- `TelegramConfig`: configuracion operativa del canal.
- `TelegramDeal`: borrador/publicacion de oferta para Telegram.
- `TelegramLog`: logs de acciones sobre Telegram.

### Energia

- `EnergyPriceSnapshot`: precio horario persistido por fecha y hora.
- `EnergyDailySummary`: resumen diario calculado.

## Estados canonicos

### LeadStatus

- `NEW`
- `QUALIFIED`
- `CONTACTED`
- `WON`
- `LOST`
- `SPAM`

### StudyStatus

- `NEW`
- `REVIEWING`
- `QUOTED`
- `WON`
- `LOST`

### PostStatus

- `DRAFT`
- `REVIEW`
- `SCHEDULED`
- `PUBLISHED`
- `ARCHIVED`

### CampaignStatus

- `DRAFT`
- `SCHEDULED`
- `SENDING`
- `SENT`
- `FAILED`

## Relaciones relevantes

- `AdminUser 1:N Post`
- `AdminUser 1:N Campaign`
- `AdminUser 1:N TelegramLog`
- `AdminUser 1:N LeadNote`
- `AdminUser 1:N AuditLog`
- `Post 1:N PostTranslation`
- `Post N:M Category`
- `Post N:M Tag`
- `Lead 1:N LeadNote`
- `Subscriber 1:N Consent`
- `Campaign 1:N CampaignBlock`
- `Campaign 1:N SendJob`
- `SendJob 1:N SendEvent`
- `Subscriber 1:N SendEvent`

## Indices clave

- `Post(status, publishedAt)` para listado editorial/publico.
- `Lead(status, createdAt)` y `Lead(email)` para operacion comercial.
- `StudyRequest(status, createdAt)` y `StudyRequest(email)` para seguimiento.
- `EmailLog(entityType, entityId)` para trazabilidad por entidad.
- `SendJob(status, runAt)` para ejecucion de cola.
- `EnergyPriceSnapshot(snapshotDate, hour)` unico para historico horario.
- `EnergyDailySummary(summaryDate)` unico para resumen diario.

## Notas de implementacion

- `Lead`, `StudyRequest` y `EmailLog` existen ya en schema y deben empezar a usarse desde las APIs publicas.
- `Offer` y `TelegramDeal` conviviran durante la transicion; la normalizacion funcional completa se abordara en la fase de ofertas y Telegram.
- `EnergyPriceSnapshot` y `EnergyDailySummary` preparan el terreno para historico, KPIs y comparativas futuras.

## Pendientes deliberados

- `EmailTemplate` se pospone hasta concretar el flujo minimo operativo de campañas.
- Estados y estructura final de `Offer` se ampliaran en la fase F para no sobredimensionar antes de tiempo.
- La tabla `AuditLog` se incorpora ya para no tener que hacer una migracion correctiva posterior cuando se endurezca el admin.
