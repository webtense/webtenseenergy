# WebtenseEnergy — Design System v1.0

Referencia completa para Claude Code. Personalidad: **MINIMALISTA · MODERNA · TÉCNICA**.
Stack: Next.js 16 App Router + Tailwind CSS v4 + `src/app/globals.css`.

---

## Reglas de uso

- Usar clases custom (`cta-primary`, `surface-panel`, etc.) antes que utilidades Tailwind para componentes recurrentes.
- NUNCA usar `prose` — reemplazado por `.article-body` con estilos propios.
- Dark mode vía `prefers-color-scheme` (automático), NO con clase `.dark`.
- Texto: castellano directo, sin fluff. Copy ejemplo: "Cuéntanos tu caso y te orientamos sin rodeos."
- Focus ring: añadir `.focus-ring` a todos los elementos interactivos custom.

---

## 1. Layout

### `.section-shell`
Wrapper de sección — padding vertical completo.
```html
<section class="section-shell">
  <div class="section-inner"><!-- contenido --></div>
</section>
```
Variantes: `.section-shell-tight` (padding reducido), `.section-shell-muted` (fondo sutilmente verde).

### `.section-inner`
Centra y limita anchura (max-width 78rem).
```html
<div class="section-inner">...</div>
```

### `.split`
Grid 2 columnas, colapsa a 1 columna en móvil.
```html
<div class="split">
  <div>Columna A</div>
  <div>Columna B</div>
</div>
```

### `.grid-auto`
Grid auto-fill responsivo — mínimo 280px por columna.
```html
<div class="grid-auto">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```
Variante: `.grid-auto-sm` (mínimo 200px).

### `.stack`
Flex column. Combinar con gap de Tailwind: `class="stack gap-4"`.

### `.cluster`
Flex row wrap. Combinar con gap: `class="cluster gap-3"`.

---

## 2. Tipografía

| Clase | Uso | Fuente |
|---|---|---|
| `.display` | Máximo tamaño — portadas, landings | Heading (Outfit) |
| `.hero-title` | Hero principal con clamp responsive | Heading |
| `.section-title` | Títulos de sección | Heading |
| `.section-copy` | Párrafo de apoyo bajo título | Sans (Inter) |
| `.lead` | Párrafo intro grande | Sans |
| `.eyebrow` | Etiqueta supratítulo con pill border | Heading |
| `.overline` | Pequeño texto uppercase con tracking | Sans |
| `.caption` | Metadatos, timestamps | Sans |
| `.gradient-text` | Gradiente primary→brand en texto | cualquiera |

```html
<!-- Patrón hero completo -->
<span class="eyebrow">Consultoría Energética</span>
<h1 class="hero-title">Paga lo justo<br>por tu energía.</h1>
<p class="section-copy">Analizamos tu consumo y te cambiamos a la tarifa óptima.</p>
```

**Nota**: `.gradient-text` requiere elemento con texto directo, no wrappers con children anidados.

---

## 3. Botones

### Variantes principales

| Clase | Uso |
|---|---|
| `.cta-primary` | Acción principal — CTA call-to-action |
| `.cta-secondary` | Acción alternativa — "Ver más", "Leer artículo" |
| `.cta-ghost` | Acción terciaria — links de navegación |
| `.cta-danger` | Acción destructiva — eliminar, cancelar |
| `.cta-icon` | Botón icono solo — sin label |

### Modificadores de tamaño
Añadir al mismo elemento:
- `.cta-sm` — padding reducido, texto 14px
- `.cta-lg` — padding amplio, texto 17px

```html
<!-- Grupo de botones típico -->
<div class="cluster gap-3">
  <a href="/estudio" class="cta-primary focus-ring">
    Solicitar estudio gratuito
    <svg><!-- arrow --></svg>
  </a>
  <a href="/como-funciona" class="cta-secondary focus-ring">
    Cómo funciona
  </a>
</div>

<!-- Botón icono -->
<button class="cta-icon focus-ring" aria-label="Compartir">
  <svg><!-- share icon --></svg>
</button>

<!-- Tamaño pequeño -->
<button class="cta-primary cta-sm focus-ring">Ver tarifa</button>
```

---

## 4. Superficies / Cards

### `.surface-panel`
Panel principal con border radius 2rem y sombra suave.

### `.surface-panel-soft`
Panel más ligero — radius 1.5rem, border más sutil.

### `.card`
Card genérica con hover lift.
```html
<article class="card">
  <h3 class="text-lg font-bold mb-2">Título</h3>
  <p class="caption">Descripción breve.</p>
</article>
```

### `.card-feature`
Card de servicio/característica con área de icono.
```html
<div class="card-feature">
  <div class="card-feature-icon">
    <svg><!-- icon 24x24 --></svg>
  </div>
  <h3 class="text-lg font-bold mb-2">Optimización tarifaria</h3>
  <p class="section-copy">Encontramos la tarifa óptima para tu perfil de consumo.</p>
</div>
```

### `.card-stat`
KPI / métrica destacada.
```html
<div class="card-stat">
  <div class="card-stat-value">€ 847</div>
  <div class="card-stat-label">Ahorro medio anual</div>
  <div class="card-stat-delta down">▼ 23% vs tarifa anterior</div>
</div>
```
Delta: añadir clase `.up` o `.down` para color semántico.

### `.card-price`
Tarjeta de pricing. Añadir `.featured` para versión destacada.
```html
<div class="card-price featured">
  <span class="eyebrow mb-4">Más popular</span>
  <div class="card-price-amount">€ 29<span class="card-price-period">/mes</span></div>
  <p class="lead mt-3">Gestión energética completa para el hogar.</p>
  <ul class="stack gap-2 mt-6 mb-8">
    <li>✓ Análisis de consumo</li>
    <li>✓ Cambio de tarifa incluido</li>
  </ul>
  <a href="/contratar" class="cta-primary">Empezar ahora</a>
</div>
```

### `.card-testimonial`
Testimonial de cliente.
```html
<div class="card-testimonial">
  <blockquote class="card-testimonial-quote">
    "En dos semanas ya estaba en la tarifa correcta. 
    Ahorro 140 € al año sin hacer nada."
  </blockquote>
  <div class="card-testimonial-author">
    <div class="card-testimonial-avatar">MG</div>
    <div>
      <div class="font-semibold text-sm">María García</div>
      <div class="caption">Madrid · Cliente desde 2024</div>
    </div>
  </div>
</div>
```

---

## 5. Badges y Pills

### `.badge` + variante semántica

```html
<span class="badge badge-success">Activo</span>
<span class="badge badge-warning">Pendiente</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-info">Nuevo</span>
<span class="badge badge-neutral">Archivado</span>
```

### `.dot` + variante
Indicador de estado inline.
```html
<span class="cluster gap-2">
  <span class="dot dot-success"></span>
  Conexión activa
</span>
```

### `.chip-outline`
Tag/etiqueta de categoría o filtro.
```html
<div class="cluster gap-2">
  <span class="chip-outline">Ahorro Energético</span>
  <span class="chip-outline">PVPC</span>
  <span class="chip-outline">Placas solares</span>
</div>
```

### `.metric-chip`
Chip de datos/métricas (existente).
```html
<span class="metric-chip">
  <svg><!-- icon --></svg>
  127 kWh / mes
</span>
```

---

## 6. Formularios

```html
<div class="form-group">
  <label for="email" class="form-label">Correo electrónico</label>
  <input 
    id="email" 
    type="email" 
    class="input focus-ring" 
    placeholder="tu@ejemplo.com"
  />
  <span class="form-hint">Solo para enviarte el informe. Sin spam.</span>
</div>

<!-- Con error -->
<div class="form-group">
  <label for="cups" class="form-label">CUPS</label>
  <input id="cups" type="text" class="input error focus-ring" />
  <span class="form-error-msg">
    <svg><!-- alert icon --></svg>
    El CUPS debe tener 20-22 caracteres.
  </span>
</div>

<!-- Textarea -->
<div class="form-group">
  <label for="mensaje" class="form-label">Tu consulta</label>
  <textarea id="mensaje" class="textarea focus-ring" rows="4"></textarea>
</div>
```

**Honeypot** (antispam — incluir en todos los forms públicos):
```html
<div style="position: absolute; left: -9999px;" aria-hidden="true">
  <input type="text" name="website" tabindex="-1" autocomplete="off" />
</div>
```

---

## 7. Alertas / Feedback

```html
<!-- Alerta de éxito -->
<div class="alert alert-success" role="alert">
  <svg><!-- check icon --></svg>
  <span>Estudio enviado. Te contactamos en menos de 24h.</span>
</div>

<!-- Alerta de error -->
<div class="alert alert-error" role="alert">
  <svg><!-- x icon --></svg>
  <span>Error al enviar. Inténtalo de nuevo o escríbenos a hola@webtenseenergy.com.</span>
</div>
```

Variantes: `.alert-success`, `.alert-warning`, `.alert-error`, `.alert-info`.

---

## 8. Loading States

### Skeleton
```html
<!-- Skeleton de card -->
<div class="card">
  <div class="skeleton skeleton-title mb-4" style="height:1.5rem"></div>
  <div class="skeleton skeleton-text mb-2" style="height:1rem; width:90%"></div>
  <div class="skeleton skeleton-text" style="height:1rem; width:70%"></div>
</div>
```

### Spinner
```html
<span class="spinner" aria-hidden="true"></span>
<!-- Con texto -->
<span class="cluster gap-2">
  <span class="spinner spinner-sm" aria-hidden="true"></span>
  Calculando tarifa óptima...
</span>
```
Tamaños: `.spinner-sm` (16px), `.spinner` (20px), `.spinner-lg` (32px).

### Progress
```html
<div class="progress-track" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-fill" style="width: 65%"></div>
</div>
```

---

## 9. Navegación

### Tabs
```html
<nav class="tab-list" role="tablist">
  <button class="tab-item active" role="tab">Resumen</button>
  <button class="tab-item" role="tab">Consumo</button>
  <button class="tab-item" role="tab">Facturas</button>
</nav>
```

### Pill nav
```html
<nav class="nav-pill-list">
  <a href="/luz" class="nav-pill active">Luz</a>
  <a href="/gas" class="nav-pill">Gas</a>
  <a href="/solar" class="nav-pill">Solar</a>
</nav>
```

### Breadcrumb
```html
<nav class="breadcrumb" aria-label="Ruta">
  <div class="breadcrumb-item">
    <a href="/">Inicio</a>
    <span aria-hidden="true">/</span>
  </div>
  <div class="breadcrumb-item">
    <a href="/blog">Blog</a>
    <span aria-hidden="true">/</span>
  </div>
  <div class="breadcrumb-item current" aria-current="page">
    Tarifa nocturna: ¿merece la pena?
  </div>
</nav>
```

---

## 10. Precios de energía

### `.price-chip`
Para mostrar precio/kWh con tendencia.
```html
<div class="price-chip">
  <span class="price-chip-amount">0,142</span>
  <span class="price-chip-unit">€/kWh</span>
</div>
<span class="price-chip-trend up">▲ +3,2%</span>

<!-- Precio a la baja -->
<span class="price-chip-trend down">▼ -1,8%</span>
```

---

## 11. Dividers

```html
<!-- Línea simple -->
<div class="divider my-8"></div>

<!-- Con texto -->
<div class="divider-text my-6">o continúa con</div>
```

---

## 12. Accordion (FAQ)

```html
<div>
  <div class="accordion-item">
    <button class="accordion-trigger focus-ring">
      ¿Cuánto tarda el proceso?
      <svg><!-- chevron --></svg>
    </button>
    <div class="accordion-content">
      Entre 24h y 72h desde que recibimos tus datos de consumo.
    </div>
  </div>
  <div class="accordion-item">
    <button class="accordion-trigger focus-ring">
      ¿Tengo que cambiar de compañía?
      <svg><!-- chevron --></svg>
    </button>
    <div class="accordion-content">
      No necesariamente. Optimizamos dentro de tu compañía actual si la tarifa es competitiva.
    </div>
  </div>
</div>
```

---

## 13. CTA Section

```html
<section class="section-shell">
  <div class="section-inner">
    <div class="cta-section">
      <span class="eyebrow">Sin compromiso</span>
      <h2 class="section-title mt-4">¿Cuánto estás pagando de más?</h2>
      <p class="lead mt-4 mb-8">
        Analizamos tu última factura y te decimos exactamente cuánto ahorrarías.
      </p>
      <a href="/estudio" class="cta-primary cta-lg focus-ring">
        Estudio gratuito — 2 minutos
      </a>
    </div>
  </div>
</section>
```

---

## 14. Tooltip

```html
<span class="tooltip-wrap" data-tooltip="Precio por kilovatio hora">
  0,142 €/kWh
</span>
```
Solo usar para definiciones o datos técnicos breves. No para contenido crítico (invisible en móvil touch).

---

## 15. Artículos de blog

Usar `.article-body` en el wrapper del contenido markdown/HTML procesado.

```tsx
<div
  className="article-body"
  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
/>
```

Soporta: `h2`, `h3`, `p`, `ul`, `ol`, `li`, `strong`, `a`, `table`, `blockquote`, `img`, `hr`.

---

## Accesibilidad — checklist

- [ ] Todos los botones/links interactivos tienen `.focus-ring`
- [ ] Imágenes con `alt` descriptivo
- [ ] Alertas con `role="alert"`
- [ ] Tabs con `role="tablist"` / `role="tab"`
- [ ] Breadcrumb con `aria-label="Ruta"` y `aria-current="page"`
- [ ] Formularios: cada `input` tiene `label` asociado por `for`/`id`
- [ ] Honeypot con `aria-hidden="true"` y `tabindex="-1"`
- [ ] Contraste mínimo 4.5:1 para texto normal (verificado en `tokens.json`)
- [ ] Progress bar con `role="progressbar"` y `aria-valuenow`

---

## Patrones responsive

| Patrón | Mobile (< 768px) | Desktop |
|---|---|---|
| `.section-shell` | padding 3.25rem 1rem | padding 4.5rem 1rem |
| `.split` | 1 columna | 2 columnas |
| `.grid-auto` | 1 columna | auto-fill min 280px |
| `.cta-section` | padding 2.5rem 1.5rem | padding 4rem 3rem |
| `.hero-title` | clamp(2.5rem, 6vw, 5.25rem) | 5.25rem |

Principio: diseñar mobile-first con Tailwind. Usar `.section-inner` siempre para centrar y limitar anchura.

---

## Variables CSS — referencia rápida

```css
/* Colores */
--color-primary-500   /* Verde #1ab775 */
--color-brand-500     /* Azul #3b76f6 */
--color-amber-500     /* Ámbar #f59e0b */
--color-red-500       /* Rojo #ef4444 */
--foreground          /* Texto principal */
--background          /* Fondo */

/* Tipografía */
--font-sans           /* Inter */
--font-heading        /* Outfit/Avenir */

/* Motion */
--duration-fast       /* 120ms */
--duration-normal     /* 180ms */
--duration-slow       /* 300ms */
--ease-standard       /* cubic-bezier(0.4,0,0.2,1) */
--ease-spring         /* cubic-bezier(0.175,0.885,0.32,1.275) */

/* Sombras */
--shadow-ambient      /* Sutil — cards en reposo */
--shadow-soft         /* Elevación media */
--shadow-glow         /* Glow verde — CTAs, cards featured */
--shadow-elevated     /* Elevación alta — dropdowns */

/* Radios */
--radius-md           /* 0.5rem — inputs */
--radius-lg           /* 0.75rem — inputs, chips */
--radius-2xl          /* 1.5rem — surface-panel-soft */
--radius-panel        /* 2rem — surface-panel, cards grandes */
--radius-full         /* 9999px — pills, badges */

/* Z-index */
--z-dropdown: 100;
--z-sticky: 200;
--z-modal: 400;
--z-toast: 500;
--z-tooltip: 600;
```

---

## Anti-patrones

- ❌ `prose` — usar `.article-body`
- ❌ Gradientes placeholder genéricos en cards — usar `card-feature-icon` con gradiente sutil
- ❌ Blockquotes con barra lateral (`border-left`) — `.article-body blockquote` usa background + border-radius
- ❌ Texto en inglés en UI pública
- ❌ Comentarios CSS innecesarios — el código se explica solo
- ❌ Clases inline de Tailwind para componentes que se repiten 3+ veces — abstraer a clase custom en `globals.css`
