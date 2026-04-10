# Documentación de APIs - API REFERENCE

## Overview

Base URL: `/api`

Todas las respuestas siguen el formato:
```json
{
  "data": { ... },
  "message": "Descripción del resultado"
}
```

---

## Endpoints Públicos

### GET /api/public/feature-flags

Devuelve los feature flags habilitados.

**Respuesta:**
```json
{
  "features": ["blog", "ofertas", "newsletter", "telegram"],
  "blog": true,
  "ofertas": true,
  "newsletter": false,
  "telegram": false
}
```

---

### GET /api/precios-luz

Obtiene precios de luz en tiempo real.

**Respuesta:**
```json
{
  "prices": [
    { "hour": "00:00", "price": 0.15, "period": "valle" },
    { "hour": "08:00", "price": 0.22, "period": "llano" }
  ],
  "average": 0.18,
  "min": 0.12,
  "max": 0.25,
  "updated": "2026-04-09T12:00:00Z"
}
```

---

### POST /api/contacto

Envía formulario de contacto.

**Body:**
```json
{
  "name": "Nombre",
  "email": "email@example.com",
  "phone": "+34600000000",
  "message": "Mensaje"
}
```

**Respuesta (éxito):**
```json
{
  "message": "Mensaje enviado correctamente"
}
```

**Respuesta (error):**
```json
{
  "message": "Error al enviar el mensaje",
  "error": "detalles"
}
```

---

### POST /api/estudio

Solicitud de estudio energético gratuito.

**Body:**
```json
{
  "name": "Nombre",
  "email": "email@example.com",
  "phone": "+34600000000",
  "type": "particular" | "empresa",
  "consumption": "150-300" | "300-500" | "500-1000" | "1000+",
  "message": "Mensaje opcional"
}
```

---

### POST /api/newsletter/subscribe

Suscripción al newsletter.

**Body:**
```json
{
  "email": "email@example.com",
  "name": "Nombre (opcional)"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "¡Te has suscrito correctamente!"
}
```

---

## Endpoints de Administración

### POST /api/admin/login

Login de administrador.

**Body:**
```json
{
  "email": "admin@webtenseenergy.com",
  "password": "password"
}
```

**Respuesta (éxito):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@webtenseenergy.com",
    "name": "Admin"
  }
}
```

**Cookies establecidas:**
- `admin-session`: JWT token (HttpOnly, SameSite=strict)

---

### POST /api/admin/logout

Cierra sesión de administrador.

**Respuesta:**
```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

---

### GET /api/admin/me

Obtiene información del admin autenticado.

**Headers:** `Cookie: admin-session=token`

**Respuesta:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@webtenseenergy.com",
    "name": "Admin"
  }
}
```

---

### GET /api/admin/posts

Lista todos los posts (protegido).

**Query params:**
- `status`: filter por estado
- `page`: número de página
- `limit`: posts por página

**Respuesta:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "slug": "slug-del-post",
      "status": "PUBLISHED",
      "locale": "ES",
      "publishedAt": "2026-04-09T12:00:00Z",
      "translations": [
        { "locale": "ES", "title": "Título ES", "excerpt": "Excerpt..." },
        { "locale": "CA", "title": "Titol CA", "excerpt": "Extracte..." }
      ]
    }
  ],
  "total": 10,
  "page": 1
}
```

---

### POST /api/admin/posts

Crea un nuevo post.

**Body:**
```json
{
  "slug": "slug-del-post",
  "locale": "ES",
  "title": "Título del post",
  "excerpt": "Extracto breve",
  "content": "Contenido HTML",
  "status": "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED",
  "featuredImage": "url-imagen",
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description"
}
```

---

### GET /api/admin/posts/[id]

Obtiene un post específico.

---

### PUT /api/admin/posts/[id]

Actualiza un post.

**Body:**
```json
{
  "slug": "nuevo-slug",
  "locale": "ES" | "CA",
  "title": "Nuevo título",
  "content": "Nuevo contenido",
  "status": "PUBLISHED",
  "featuredImage": "url"
}
```

---

### DELETE /api/admin/posts/[id]

Elimina un post.

---

### GET /api/admin/feature-flags

Obtiene todos los feature flags.

**Respuesta:**
```json
{
  "flags": [
    { "key": "blog", "enabled": true, "description": "Blog enabled" },
    { "key": "ofertas", "enabled": true },
    { "key": "newsletter", "enabled": false },
    { "key": "telegram", "enabled": false }
  ]
}
```

---

### PUT /api/admin/feature-flags

Actualiza feature flags.

**Body:**
```json
{
  "flags": [
    { "key": "newsletter", "enabled": true }
  ]
}
```

---

### GET /api/admin/site-settings

Obtiene configuración del sitio.

---

### PUT /api/admin/site-settings

Actualiza configuración del sitio.

**Body:**
```json
{
  "siteName": "WEBTENSE ENERGY",
  "contactEmail": "info@webtenseenergy.com",
  "maintenance": false
}
```

---

## Endpoints de IA

### POST /api/ai/newsletter-suggest

Genera sugerencia de newsletter con IA.

**Body:**
```json
{
  "topic": "eficiencia energética",
  "tone": "profesional" | "casual" | "técnico"
}
```

**Respuesta:**
```json
{
  "suggestion": {
    "subject": "Asunto sugerido",
    "preview": "Preview text...",
    "content": "Contenido generado..."
  }
}
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado |
| 400 | Bad Request |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | No encontrado |
| 429 | Rate limit excedido |
| 500 | Error interno |

---

## Rate Limiting

- **Público**: 100 peticiones/minuto por IP
- **Admin**: 200 peticiones/minuto por sesión

Headers de rate limit:
- `X-RateLimit-Limit`: Límite
- `X-RateLimit-Remaining`: Restantes
- `X-RateLimit-Reset`: Reseteo