# Registro de Cambios - CHANGELOG

## [1.0.0] - 2026-04-09

### Añadido
- **Frontend completo**: Next.js 16 con React 19
- **Biblioteca de componentes**: Header, Footer, Cards, Forms
- **Blog system**: CRUD con traducciones ES/CA
- **Panel admin**: Dashboard, gestión posts, configuración
- **Newsletter**: Formulario de suscripción + IA (OpenRouter)
- **Ofertas page**: Sistema de chollos
- **Widget WhatsApp**: Botón flotante de contacto
- **Integración Telegram**: Botón de Deals

### Seguridad
- Rate limiting (100 req/min)
- Sanitización XSS (sanitize-html)
- CSRF protection (validación origen)
- Cookie security (HttpOnly, SameSite=strict)
- Security headers (X-Frame, X-Content-Type)

### Base de Datos
- PostgreSQL con Prisma 7
- Modelos: AdminUser, Post, PostTranslation, Campaign, Subscriber, TelegramDeal, FeatureFlag, SiteSetting

### Documentación
- README.md
- LIBRO_DE_ESTILOS.md
- CHANGELOG.md

### Infrastructura
- Docker image para producción
- EasyPanel configuration
- GHCR registry setup

---

## Notas de Desarrollo

### 2026-04-08 - Sesión inicial
- Análisis del proyecto existente
- Identificación de requisitos
- Implementación de seguridad básica
- Migración SQLite → PostgreSQL

### 2026-04-09 - Despliegue
- build de imagen Docker
- Configuración de contenedor
- Preparación documentación

---

## Pendiente
- [ ] Testing completo de API endpoints
- [ ] Usuario admin inicial (seed)
- [ ] Configuración de Traefik/EasyPanel para producción
- [ ]ssl/HTTPS
- [ ] Monitoring y logs