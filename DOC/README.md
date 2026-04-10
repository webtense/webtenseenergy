# WEBTENSE ENERGY - Documentación del Proyecto

## Índice

1. [Visión General](#visión-general)
2. [Tecnología](#tecnología)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Funcionalidades](#funcionalidades)
5. [Seguridad](#seguridad)
6. [Despliegue](#despliegue)
7. [Contribución](#contribución)

---

## Visión General

**WEBTENSE ENERGY** es una plataforma web especializada en eficiencia energética y domótica práctica. El proyecto incluye:

- Frontend moderno con Next.js 16
- Backend con API REST
- Panel de administración
- Sistema de blog con multiidioma (ES/CA)
- Newsletter con IA integrada
- Sistema de ofertas y chollos
- Integración con Telegram

---

## Tecnología

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Next.js API Routes |
| Base de datos | PostgreSQL (EasyPanel) |
| ORM | Prisma 7 |
| Autenticación | NextAuth.js, bcryptjs |
| IA | OpenRouter (modelos gratuitos) |
| Seguridad | sanitize-html, rate limiting, CORS |
| Despliegue | Docker, GHCR |

---

## Estructura del Proyecto

```
webtenseEnergy/
├── src/
│   ├── app/                    # Rutas de Next.js
│   │   ├── api/                # API Routes
│   │   │   ├── admin/          # Endpoints admin
│   │   │   ├── public/         # Endpoints públicos
│   │   │   ├── ai/             # Endpoints IA
│   │   │   └── newsletter/     # Newsletter
│   │   ├── admin/              # Páginas admin
│   │   ├── blog/               # Blog público
│   │   ├── ofertas/           # Ofertas
│   │   └── page.tsx           # Homepage
│   ├── components/             # Componentes React
│   │   ├── admin/              # Componentes admin
│   │   ├── layout/             # Layout (Header, Footer)
│   │   └── ui/                 # Componentes UI
│   └── lib/                    # Utilidades y lógica
│       ├── db.ts              # Prisma client
│       ├── admin-auth.ts     # Autenticación admin
│       ├── security.ts       # Rate limiting, sanitización
│       ├── features.ts       # Feature flags
│       └── ai/                # Integración OpenRouter
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── public/                    # Archivos estáticos
├── DOC/                       # Documentación
├── Dockerfile                 # Imagen Docker
├── next.config.ts            # Configuración Next.js
├── tailwind.config.ts        # Configuración Tailwind
└── easypanel.json             # Configuración EasyPanel
```

---

## Funcionalidades

### Frontend Público

- **Homepage**: Banner principal (25% reducido), servicios, blog destacados
- **Blog**: Artículos sobre eficiencia energética, domótica
- **Ofertas**: Chollos y ofertas del sector energético
- **Precio Luz**: Consulta de precios en tiempo real
- **Newsletter**: Suscripción con integración IA
- **Estudio Gratuito**: Formulario de contacto
- **WhatsApp Widget**: Botón flotante de contacto

### Panel de Administración

- **Login/Logout**: Autenticación segura con cookies HttpOnly
- **Dashboard**: Estado del sistema, feature flags, configuración
- **Gestión Posts**: CRUD completo con traducciones ES/CA
- **Configuración**: Site settings, feature flags
- ** IA Assist**: Generación de contenido para newsletter

### API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/public/feature-flags` | GET | Feature flags públicos |
| `/api/precios-luz` | GET | Precios de luz en tiempo real |
| `/api/contacto` | POST | Formulario de contacto |
| `/api/estudio` | POST | Estudio gratuito |
| `/api/newsletter/subscribe` | POST | Suscripción newsletter |
| `/api/admin/login` | POST | Login admin |
| `/api/admin/logout` | POST | Logout admin |
| `/api/admin/me` | GET | Info usuario actual |
| `/api/admin/posts` | GET/POST | Listar/Crear posts |
| `/api/admin/posts/[id]` | GET/PUT/DELETE | Gestionar post específico |
| `/api/admin/feature-flags` | GET/PUT | Feature flags admin |
| `/api/admin/site-settings` | GET/PUT | Configuración del sitio |
| `/api/ai/newsletter-suggest` | POST | Sugerencias IA para newsletter |

---

## Seguridad

### Implementaciones Actuales

- **Rate Limiting**: 100 peticiones/minuto por IP
- **Sanitización**: sanitize-html para XSS
- **CSRF Protection**: Validación de origen
- **Cookie Security**: HttpOnly, SameSite=strict
- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **Validación de Entrada**: Zod en endpoints críticos
- **Password Hashing**: bcryptjs

### Variables de Entorno Requeridas

```
DATABASE_URL=postgresql://postgres:password@host:5432/dbname
ADMIN_SECRET=your-secret-key
OPENROUTER_API_KEY=sk-... (opcional)
```

---

## Despliegue

### build local (EasyPanel)

```bash
# 1. Generar cliente Prisma
npm run db:generate

# 2. Build Docker
docker build --platform linux/amd64 -t ghcr.io/webtense/webtenseenergy/webtense-energy:latest .

# 3. Push a registry
docker push ghcr.io/webtense/webtenseenergy/webtense-energy:latest
```

### Configuración EasyPanel

```json
{
  "name": "webtense-energy",
  "services": {
    "webtense-energy": {
      "image": "ghcr.io/webtense/webtenseenergy/webtense-energy:latest",
      "environment": {
        "DATABASE_URL": "postgresql://app_user:strong_password@db.internal:5432/webtense_energy?schema=public",
        "ADMIN_SESSION_SECRET": "set-this-in-easypanel"
      },
      "domains": [{
        "host": "webtenseenergy.com",
        "port": 3010
      }]
    }
  }
}
```

---

## Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Normas de Código

- Usar TypeScript estricto
- ESLint y Prettier configurados
- Componentes funcionales con hooks
- Nombres descriptivos en español para UI
- Documentar APIs con JSDoc

---

## Licencia

MIT License - © 2026 WEBTENSE ENERGY
