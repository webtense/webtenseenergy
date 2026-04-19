# Roadmap 3.2+

## Estado actual

- `v3.1` consolidó el backoffice por dominios, newsletter manager, ajustes, versionado, IA editorial y automatización diaria.
- `v3.2` empuja el producto hacia operación, segmentación y conversión.

## v3.2.0 - Operación, Segmentación y Conversión

- [x] Bootstrap robusto de `feature flags` y `site settings` públicos
- [x] Segmentación de campañas newsletter por locale, fuente y consentimiento
- [x] Vista unificada de `Personas` con timeline por email
- [x] Versión canónica actualizada a `3.2.0`

## Próximo bloque recomendado: v3.2.x

### Seguridad y operación
- [ ] Rotar secretos expuestos en flujos, servidor y herramientas auxiliares
- [ ] Mover n8n a credenciales reales sin `Authorization` hardcodeada
- [ ] Añadir monitorización mínima y alerta de fallo en automatización diaria
- [ ] Documentar rollback real de producción paso a paso

### CRM ligero y conversión
- [ ] Añadir etiquetas manuales por persona
- [ ] Añadir scoring comercial simple
- [ ] Filtros persistentes y acciones bulk en `Contactos`
- [ ] Exportación por segmentos guardados

### Newsletter y automatización comercial
- [ ] Plantillas reutilizables de campaña
- [ ] Secuencia de bienvenida automática
- [ ] Secuencia de reactivación de suscriptores inactivos
- [ ] Métricas de apertura y clic cuando el proveedor lo permita

### Contenido y SEO
- [ ] Related posts
- [ ] Schema.org para blog, negocio y ofertas
- [ ] Calendario editorial desde admin
- [ ] Sugerencias IA de CTA, interlinking y newsletter derivada

### Analítica first-party
- [ ] Captura de referrer y UTM
- [ ] Mini dashboard de adquisición y conversión
- [ ] Vista landing -> lead / estudio / newsletter

## Principios

- Mantener monolito modular en Next.js
- Evitar cambios manuales opacos en producción
- Priorizar mejoras con retorno operativo real
