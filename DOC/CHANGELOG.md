# Registro de Cambios - CHANGELOG

## [3.2.1] - 2026-04-19

### Corregido
- Respuesta publica de `feature flags` alineada entre `features[]` y los booleanos expuestos
- Render del formulario de newsletter ajustado para no mostrar contenido mientras el flag publico sigue desactivado
- Compatibilidad de build en produccion al retirar la dependencia de `next/font/google` dentro de la imagen Docker

---

## [3.2.0] - 2026-04-19

### Anadido
- Panel de `Personas` con consolidacion por email y timeline comercial unificado a partir de leads, estudios, suscriptores y actividad email/newsletter
- Segmentacion operativa en newsletter por locale, fuente, consentimiento y altas recientes sin necesidad de migracion adicional

### Mejorado
- Bootstrap robusto de `feature flags` y `site settings` publicos para no depender de una visita previa al admin
- Backoffice orientado a conversion y operacion, con mejor lectura del estado real de audiencia y contactos
- Version canonica actualizada a `v3.2.0`

---

## [3.1.0] - 2026-04-19

### Anadido
- Backoffice v3.1 por dominios: resumen, contenido, ofertas y Telegram, contactos, newsletter, ajustes y sistema
- Hub unificado de contactos con leads, estudios, suscriptores y exportacion CSV
- Newsletter manager con campanas manuales, bloques editables, envio de prueba y envio real
- Ajustes ampliados para home, newsletter publica y footer
- Footer versionado con `v3.1.0`

### Mejorado
- Reorganizacion del panel admin para cargar cada area por separado
- Visibilidad operativa de auditoria, email errors y configuracion Telegram

---

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
