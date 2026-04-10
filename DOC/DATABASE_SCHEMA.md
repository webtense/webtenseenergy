# Esquema de Base de Datos - DATABASE SCHEMA

## Overview

Tipo: PostgreSQL
ORM: Prisma 7
Host: EasyPanel (10.0.104.4:5432)
Base de datos: webtense_energy

---

## Modelos

### AdminUser

Usuario administrador del sistema.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| email | String | Sí | Email (único) |
| passwordHash | String | Sí | Contraseña hasheada |
| name | String | No | Nombre para mostrar |
| role | Enum | Sí | Rol (ADMIN, EDITOR) |
| createdAt | DateTime | Sí | Fecha de creación |
| updatedAt | DateTime | Sí | Fecha de actualización |

```prisma
model AdminUser {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String?
  role         AdminRole @default(ADMIN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum AdminRole {
  ADMIN
  EDITOR
}
```

---

### Post

Artículo del blog.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| slug | String | Sí | Slug URL (único) |
| locale | String | Sí | Idioma (ES/CA) |
| status | Enum | Sí | Estado del post |
| featuredImage | String? | No | URL imagen destacada |
| seoTitle | String? | No | Meta title |
| seoDescription | String? | No | Meta description |
| publishedAt | DateTime? | No | Fecha de publicación |
| scheduledFor | DateTime? | No | Fecha programada |
| createdAt | DateTime | Sí | Fecha de creación |
| updatedAt | DateTime | Sí | Fecha de actualización |

```prisma
model Post {
  id              String        @id @default(uuid())
  slug            String        @unique
  locale          String        @default("ES")
  status          PostStatus    @default(DRAFT)
  featuredImage   String?
  seoTitle        String?
  seoDescription  String?
  publishedAt     DateTime?
  scheduledFor    DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  translations     PostTranslation[]
}

enum PostStatus {
  DRAFT
  REVIEW
  SCHEDULED
  PUBLISHED
  ARCHIVED
}
```

---

### PostTranslation

Traducciones de posts (ES/CA).

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| postId | UUID | Sí | FK a Post |
| locale | String | Sí | Idioma (ES/CA) |
| title | String | Sí | Título |
| excerpt | String? | No | Extracto |
| content | String? | No | Contenido HTML |

```prisma
model PostTranslation {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  locale    String
  title     String
  excerpt   String?
  content   String?
  
  @@unique([postId, locale])
}
```

---

### Subscriber

Suscriptor del newsletter.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| email | String | Sí | Email (único) |
| name | String? | No | Nombre |
| locale | String | Sí | Idioma preferido |
| subscribed | Boolean | Sí | Estado de suscripción |
| subscribedAt | DateTime | Sí | Fecha de suscripción |
| unsubscribedAt | DateTime? | No | Fecha de baja |

```prisma
model Subscriber {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  locale        String    @default("ES")
  subscribed    Boolean   @default(true)
  subscribedAt  DateTime  @default(now())
  unsubscribedAt DateTime?
}
```

---

### Campaign

Campaña de newsletter.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| subject | String | Sí | Asunto |
| previewText | String? | No | Preview |
| content | String | Sí | Contenido HTML |
| status | Enum | Sí | Estado |
| scheduledFor | DateTime? | No | Fecha de envío |
| sentAt | DateTime? | No | Fecha de envío real |
| stats | Json? | No | Estadísticas |

```prisma
model Campaign {
  id            String        @id @default(uuid())
  subject       String
  previewText   String?
  content       String        @db.Text
  status        CampaignStatus @default(DRAFT)
  scheduledFor  DateTime?
  sentAt        DateTime?
  stats         Json?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  FAILED
}
```

---

### TelegramDeal

Ofertas de Telegram.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| title | String | Sí | Título |
| description | String? | No | Descripción |
| price | Decimal? | No | Precio |
| originalPrice | Decimal? | No | Precio original |
| url | String | Sí | Enlace externo |
| imageUrl | String? | No | Imagen |
| active | Boolean | Sí | Estado activo |
| expiresAt | DateTime? | No | Fecha de expiración |

```prisma
model TelegramDeal {
  id            String    @id @default(uuid())
  title         String
  description   String?
  price         Decimal?  @db.Decimal(10, 2)
  originalPrice Decimal?  @db.Decimal(10, 2)
  url           String
  imageUrl      String?
  active        Boolean   @default(true)
  expiresAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

---

### FeatureFlag

Feature flags del sistema.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| key | String | Sí | Clave única |
| enabled | Boolean | Sí | Estado habilitado |
| description | String? | No | Descripción |

```prisma
model FeatureFlag {
  id          String   @id @default(uuid())
  key         String   @unique
  enabled     Boolean  @default(false)
  description String?
}
```

---

### SiteSetting

Configuración del sitio.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| key | String | Sí | Clave única |
| value | String | No | Valor |
| type | Enum | Sí | Tipo de valor |

```prisma
model SiteSetting {
  id    String        @id @default(uuid())
  key   String        @unique
  value String?
  type  SettingType   @default(STRING)
}

enum SettingType {
  STRING
  NUMBER
  BOOLEAN
  JSON
}
```

---

## Índices

```prisma
// Post
@@index([status])
@@index([publishedAt])
@@index([locale])

// PostTranslation
@@unique([postId, locale])

// Subscriber
@@index([subscribed])

// Campaign
@@index([status])
@@index([scheduledFor])
```

---

## Relaciones

```
AdminUser (1) ─── (N) Post
Post (1) ─── (N) PostTranslation
Subscriber (1) ─── (N) Campaign
```

---

## Notas

1. Soft delete para subscribers (campo `unsubscribedAt`)
2. Scheduling de posts y campañas con `scheduledFor`
3. Feature flags para activar/desactivar funcionalidades sin deploy
4. Site settings para configuración runtime