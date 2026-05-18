<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-system -->
## Design System v1.0

Full reference: `docs/design-system/COMPONENTS.md`
Design tokens (JSON): `docs/design-system/tokens.json`
CSS source: `src/app/globals.css`

### Rules

- Use custom classes BEFORE Tailwind utilities for recurring components.
- NEVER use `prose` — use `.article-body` instead.
- Dark mode via `prefers-color-scheme` only — never `.dark` class.
- Add `.focus-ring` to every custom interactive element.

### Key classes

**Layout**: `.section-shell`, `.section-shell-tight`, `.section-shell-muted`, `.section-inner`, `.split`, `.grid-auto`, `.stack`, `.cluster`

**Typography**: `.hero-title`, `.section-title`, `.section-copy`, `.eyebrow`, `.display`, `.lead`, `.overline`, `.caption`, `.gradient-text`

**Buttons**: `.cta-primary`, `.cta-secondary`, `.cta-ghost`, `.cta-danger`, `.cta-icon` + modifiers `.cta-sm` / `.cta-lg`

**Surfaces**: `.surface-panel`, `.surface-panel-soft`, `.card`, `.card-feature`, `.card-stat`, `.card-price`, `.card-price.featured`, `.card-testimonial`

**Forms**: `.form-group`, `.form-label`, `.form-hint`, `.form-error-msg`, `.input`, `.input.error`, `.textarea`

**Badges**: `.badge` + `.badge-success/warning/error/info/neutral`, `.dot` + `.dot-success/warning/error/info/neutral`, `.chip-outline`, `.metric-chip`

**Feedback**: `.alert` + `.alert-success/warning/error/info`, `.skeleton`, `.progress-track` + `.progress-fill`, `.spinner` + `.spinner-sm/lg`

**Nav**: `.tab-list`, `.tab-item`, `.tab-item.active`, `.nav-pill-list`, `.nav-pill`, `.nav-pill.active`, `.breadcrumb`

**Misc**: `.divider`, `.divider-text`, `.accordion-item`, `.accordion-trigger`, `.accordion-content`, `.cta-section`, `.price-chip`, `.tooltip-wrap`, `.focus-ring`, `.scrollbar-hide`

### CSS tokens

```
--color-primary-500   #1ab775   Verde — success, CTAs, confirmaciones
--color-brand-500     #3b76f6   Azul — info, tech, datos
--color-amber-500     #f59e0b   Ámbar — precios, advertencias
--color-red-500       #ef4444   Rojo — errores, precios al alza
--duration-normal     180ms     Transición estándar
--ease-standard       cubic-bezier(0.4,0,0.2,1)
--shadow-glow                   Sombra verde — CTAs, cards featured
--z-modal             400
--z-tooltip           600
```

### Anti-patterns

- ❌ `prose` → usar `.article-body`
- ❌ Gradiente placeholder en cards → usar `.card-feature-icon`
- ❌ Blockquotes con `border-left` → `.article-body blockquote` usa border-radius
- ❌ Clases Tailwind inline para componentes que se repiten 3+ veces → abstraer a clase custom
<!-- END:design-system -->
