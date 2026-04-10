# Libro de Estilos - WEBTENSE ENERGY

## Identidad Visual

### Colores

#### Palette Principal

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| Primary Green | `#1BB574` | 27, 181, 116 | Botones principales, acentos, CTAs |
| Primary Dark | `#0D4B34` | 13, 75, 52 | Headers, texto destacado |
| Brand Orange | `#FF6B35` | 255, 107, 53 | Ofertas, alertas, Telegram |
| Brand Dark | `#E85A24` | 232, 90, 36 | Hover en brand |

#### Colores de Fondo

| Nombre | Hex | Uso |
|--------|-----|-----|
| Background | `#FAFAFA` | Fondo general |
| Background Dark | `#020610` | Footer, secciones oscuras |
| Card | `#FFFFFF` | Tarjetas, elementos elevados |

#### Colores Semánticos

| Nombre | Hex | Uso |
|--------|-----|-----|
| Success | `#22C55E` | Estados exitosos |
| Warning | `#F59E0B` | Advertencias |
| Error | `#EF4444` | Errores |
| Info | `#3B82F6` | Información |

#### Escala de Grises

| Nombre | Hex | Uso |
|--------|-----|-----|
| foreground | `#09090B` | Texto principal |
| muted | `#71717A` | Texto secundario |
| border | `#E4E4E7` | Bordes |
| zinc-400 | `#A1A1AA` | Placeholder |
| zinc-500 | `#71717A` | Disabled |
| zinc-900 | `#18181B` | Fondo oscuro |

### Tipografía

#### Fuentes

| Uso | Familia | Peso | Tamaño |
|-----|---------|------|--------|
| Headings | Inter | 700-900 | 24-48px |
| Body | Inter | 400-500 | 14-16px |
| Display | Outfit | 600-800 | 36-72px |
| Code | JetBrains Mono | 400 | 13px |

#### Escala Tipográfica

```
xl: 72px    (hero)
lg: 36px    (h1)
md: 24px    (h2)
sm: 18px    (h3)
base: 16px  (body)
xs: 14px    (small)
xs: 12px    (caption)
```

### Espaciado

- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128

### Sombras

```css
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow-md: 0 4px 6px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
shadow-xl: 0 20px 25px rgba(0,0,0,0.15)
shadow-primary: 0 0 20px rgba(27,181,116,0.3)
```

---

## Componentes UI

### Buttons

#### Primary Button
```css
bg-primary-600 (#1BB574)
text-white
rounded-full
px-4 py-2
hover: bg-primary-500
hover:shadow-lg hover:shadow-primary-600/25
```

#### Secondary Button
```css
bg-white
text-primary-600
border border-primary-600
rounded-full
px-4 py-2
hover:bg-primary-50
```

#### Brand Button (Telegram)
```css
bg-brand-600 (#FF6B35)
text-white
rounded-full
px-4 py-2
hover:bg-brand-500
```

### Cards

```css
bg-white
rounded-2xl
p-6
shadow-md
border border-gray-100
```

### Form Inputs

```css
w-full
px-4 py-3
rounded-lg
border border-gray-200
focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
placeholder:text-gray-400
```

### Badges

```css
px-3 py-1
rounded-full
text-xs font-semibold
```

Variantes:
- `bg-primary-100 text-primary-700` - Primary
- `bg-brand-100 text-brand-700` - Brand/Offers
- `bg-gray-100 text-gray-700` - Neutral

---

## Layout

### Responsive Breakpoints

```
sm: 640px   # Móviles grandes
md: 768px   # Tablets
lg: 1024px  # Portátiles
xl: 1280px  # Desktop
2xl: 1536px # Pantallas grandes
```

### Container

```css
max-width: 1280px
mx-auto
px-4 sm:px-6 lg:px-8
```

### Grid

- 12-column grid system
- Gap: 6 (24px default)
- Variantes: sm:grid-cols-2, md:grid-cols-3, lg:grid-cols-4

---

## Elementos Específicos

### Header/Navbar

```css
sticky top-0
z-50
bg-background/80 backdrop-blur-md
border-b border-gray-200/10
h-16
```

### Footer

```css
bg-[#020610]  /* Fondo oscuro */
text-zinc-400
pt-16 pb-8
border-t border-white/10
```

### Hero Banner

- **Reducido 25%** vs versión anterior
- Height: auto con aspect-ratio
- Gradient overlay para texto

### Blog Cards

```css
group
hover:scale-[1.02]
transition-all duration-300
rounded-xl overflow-hidden
```

### Newsletter Form

```css
flex flex-col sm:flex-row gap-3
input: flex-1
button: whitespace-nowrap
```

---

## Animaciones

### Transiciones

```css
transition-all duration-300
transition-colors duration-200
transition-transform duration-200
```

### Efectos Hover

- Scale: `hover:scale-105`
- Translate: `hover:-translate-y-1`
- Shadow: `hover:shadow-lg`

### Animaciones Especiales

```css
animate-pulse     // Loading states
animate-spin      // Spinner
animate-bounce    // Notificaciones
```

### Gradientes

```css
/* Primary gradient */
bg-gradient-to-r from-primary-500 to-primary-600

/* Brand gradient */
bg-gradient-to-r from-brand-500 to-brand-600

/* Background effects */
bg-gradient-to-b from-transparent via-primary-900/20 to-transparent
```

---

## Iconos

### Sistema de Iconos

- **Principal**: Lucide React
- **Social**: Font Awesome (fab, fas)

### Tamaño Estándar

```
icon-sm: 16px
icon-md: 20px
icon-lg: 24px
icon-xl: 32px
```

---

## Estados

### Loading

```css
animate-pulse
bg-gray-200
```

### Disabled

```css
opacity-50
cursor-not-allowed
```

### Error

```css
border-error-500
text-error-500
```

---

## Z-Index Scale

```
z-0: 0
z-10: 10
z-20: 20     // Dropdowns
z-30: 30     // Sticky headers
z-40: 40     // Modals
z-50: 50     // Popovers
z-60: 60     // Toast notifications
```

---

## Accesibilidad

- Contraste mínimo WCAG AA
- Focus rings visibles
- Labels en español
- Mensajes de error claros
- Soporte keyboard navigation

---

## Notas de Implementación

1. **Tailwind CSS v4** - Usar nueva sintaxis con CSS nativo
2. **Next.js 16** - App Router, Server Components por defecto
3. **Inter + Outfit** - Fuentes de Google Fonts
4. **Dark mode** - No implementado (solo tema claro)