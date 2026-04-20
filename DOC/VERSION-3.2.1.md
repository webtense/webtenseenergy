# Webtense Energy v3.2.1

## Objetivo

Cerrar el remate de `v3.2.x` con foco en coherencia pública, estabilidad de build y alineación operativa entre frontend, admin y producción.

## Qué incluye

- Corrección de la respuesta pública de `feature flags`.
- Corrección del render del bloque público de newsletter.
- Compatibilidad de build en producción sin dependencia de `next/font/google` dentro de Docker.
- Consolidación documental de lo entregado en `v3.2.0` y `v3.2.1`.

## Estado funcional esperado

### Público

- `GET /api/public/feature-flags` debe devolver:
  - `features[]` coherente con los booleanos `blog`, `ofertas`, `newsletter`, `telegram`
  - valores por defecto consistentes incluso si falla una lectura puntual de DB
- `GET /api/public/site-settings?locale=ES|CA` debe devolver valores útiles aunque el admin no haya entrado antes.
- El formulario de newsletter no debe aparecer si `newsletter` está desactivado.
- El footer debe mostrar siempre la versión canónica actual.

### Admin

- `Ajustes` debe seguir permitiendo activar o desactivar `blog`, `ofertas`, `newsletter` y `telegram`.
- El estado del admin y el estado público no deben divergir por payloads incoherentes.
- La parte de `Personas` y `Newsletter` añadida en `v3.2.0` debe seguir intacta.

### Build y despliegue

- `npm run typecheck` debe pasar.
- `npm run build` debe pasar.
- El `docker build` de producción debe completar sin romper por fuentes Google ni por resolución interna de Turbopack.
- La imagen `ghcr.io/webtense/webtenseenergy/webtense-energy:latest` debe poder desplegarse en `wts_prod`.

## Cambios incluidos en v3.2.0 y que deben preservarse

### Conversión y operación

- Bootstrap robusto de `feature flags` y `site settings` públicos.
- Segmentación de newsletter por:
  - locale
  - fuente
  - consentimiento
  - actividad o ventana reciente
- Vista unificada de `Personas` con consolidación por email.
- Timeline de actividad por contacto.

### Contenido y editorial

- Generador IA de artículos desde admin.
- Categoría editorial `Home Assistant`.
- Footer y home versionados.

### Automatización

- Automatización diaria de:
  - ofertas
  - blog a Telegram
  - newsletter
  - pipeline

## Cambios específicos de v3.2.1

### 1. Feature flags públicos coherentes

Archivos implicados:

- `src/lib/features.ts`
- `src/app/api/public/feature-flags/route.ts`

Requisitos:

- Construir un estado público único a partir de defaults + DB.
- No devolver `features: []` si los booleanos indican otra cosa.
- Usar fallback consistente también en caso de error.

Checklist:

- [x] Añadir `getPublicFeatureState()`.
- [x] Basar la respuesta pública en una única fuente de verdad.
- [x] Mantener defaults de `blog` y `ofertas` activos, `newsletter` y `telegram` inactivos.

### 2. Render estable de newsletter pública

Archivo implicado:

- `src/components/layout/NewsletterForm.tsx`

Requisitos:

- No mostrar el bloque antes de conocer el flag público.
- Evitar flash visual cuando `newsletter` está apagado.
- Mantener carga dinámica del copy desde `site-settings`.

Checklist:

- [x] Cambiar estado inicial a `null`.
- [x] Renderizar solo si `newsletterEnabled === true`.
- [x] Tratar errores de fetch como `newsletter` desactivado.

### 3. Build de producción robusto

Archivos implicados:

- `src/app/layout.tsx`
- `src/app/globals.css`

Requisitos:

- No depender de `next/font/google` dentro de la imagen Docker.
- Mantener jerarquía tipográfica razonable con stacks del sistema.

Checklist:

- [x] Retirar import de `Inter` y `Outfit` desde `next/font/google`.
- [x] Pasar a variables CSS con fuentes de sistema.
- [x] Validar `typecheck` y `build` local después del cambio.

## Validación obligatoria

### Local

- [x] `npm run typecheck`
- [x] `npm run build`

### Producción

- [ ] Construir imagen Docker final de `v3.2.1`
- [ ] Publicar imagen en GHCR
- [ ] Actualizar servicio `wts_prod`
- [ ] Verificar `https://webtenseenergy.com`
- [ ] Verificar `GET /api/public/feature-flags`
- [ ] Verificar `GET /api/public/site-settings?locale=ES`
- [ ] Confirmar versión visible `v3.2.1`
- [ ] Confirmar que newsletter no aparece cuando el flag está en `false`

## Incidencia abierta al crear este documento

El último intento de build/push de imagen para `v3.2.1` falló en:

- `npx prisma generate`

Eso implica que antes de cerrar el despliegue hay que revisar el error exacto del contenedor y corregirlo si no es un fallo transitorio de red o entorno.

## Pendientes recomendados después de v3.2.1

### P0 Seguridad y operación

- [ ] Rotar secretos expuestos en flujos, servidor y herramientas auxiliares.
- [ ] Mover n8n a credenciales reales, sin `Authorization` hardcodeada.
- [ ] Añadir monitorización mínima y alertas de fallo en automatización diaria.
- [ ] Documentar rollback real paso a paso.

### P1 CRM y conversión

- [ ] Añadir etiquetas manuales por persona.
- [ ] Añadir scoring comercial básico.
- [ ] Añadir filtros persistentes y acciones bulk en `Contactos`.
- [ ] Añadir exportación por segmentos guardados.

### P1 Newsletter y automatización comercial

- [ ] Plantillas reutilizables.
- [ ] Secuencia de bienvenida automática.
- [ ] Secuencia de reactivación.
- [ ] Métricas de apertura y clic cuando el proveedor lo permita.

### P2 Contenido y SEO

- [ ] Related posts.
- [ ] Schema.org en blog, negocio y ofertas.
- [ ] Calendario editorial desde admin.
- [ ] Sugerencias IA de CTA, interlinking y newsletter derivada.

### P2 Analítica first-party

- [ ] Captura de referrer y UTM.
- [ ] Dashboard simple de adquisición.
- [ ] Vista landing -> lead / estudio / newsletter.

## Resumen ejecutivo

`v3.2.1` no es una expansión funcional grande: es un cierre técnico y operativo de `v3.2.0`.

Su misión es dejar el sistema más coherente en tres capas:

- payload público fiable
- UI pública estable
- build de producción reproducible

Cuando este bloque esté desplegado y verificado en producción, el siguiente frente correcto ya es `P0 seguridad/operación`.
