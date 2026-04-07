# WEBTENSE ENERGY

> Plataforma web de consultoría energética y domótica para hogares y empresas en España.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-cyan)

## Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Primeros Pasos](#primeros-pasos)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [API Endpoints](#api-endpoints)
- [Seguridad](#seguridad)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

## Descripción

WEBTENSE ENERGY es una plataforma web especializada en eficiencia energética y domótica. La aplicación ofrece:

- **Consultoría B2B**: Servicios de optimización energética para empresas
- **Servicios Residenciales**: Tarifas, solar y domótica para hogares
- **Blog Educativo**: Artículos sobre ahorro y automatización
- **Canal de Ofertas**: Productos y componentes al mejor precio
- **Dashboard de Precios**: Precios actuales de electricidad
- **Wizard de Auditoría**: Estudio energético gratuito

## Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| **Next.js 16** | Framework React con App Router |
| **React 19** | Biblioteca de UI |
| **TypeScript 5** | Tipado estático |
| **Tailwind CSS v4** | Framework de estilos |
| **Prisma ORM** | ORM para base de datos (SQLite) |
| **NextAuth v5** | Sistema de autenticación |
| **Nodemailer** | Envío de emails |

## Estructura del Proyecto

```
webtenseEnergy/
├── prisma/
│   └── schema.prisma       # Modelos de base de datos
├── public/
│   └── images/             # Recursos estáticos
├── scripts/
│   ├── import_wp.js        # Importador de WordPress
│   └── parse-wp-xml.mjs    # Parser XML alternativo
├── src/
│   ├── app/                # Páginas (App Router)
│   │   ├── api/           # API Routes
│   │   │   ├── contacto/   # Endpoint de contacto
│   │   │   └── estudio/   # Endpoint de estudio energético
│   │   ├── blog/          # Blog listing + [slug]
│   │   ├── empresas/       # Página B2B
│   │   ├── particulares/  # Página residencial
│   │   ├── ofertas/       # Canal de ofertas
│   │   ├── estudio/       # Wizard de auditoría
│   │   ├── contacto/      # Formulario de contacto
│   │   ├── luz/           # Dashboard de precios
│   │   ├── layout.tsx     # Layout principal
│   │   ├── page.tsx       # Homepage
│   │   └── globals.css    # Estilos globales
│   ├── components/
│   │   ├── layout/        # Header, Footer
│   │   ├── blog/          # ArticleCard
│   │   ├── electricity/    # ElectricityDashboard
│   │   └── ui/            # Wizard, WhatsAppWidget
│   ├── data/
│   │   └── posts.json     # Datos de blog (importado de WP)
│   └── lib/
│       ├── posts.ts       # Utilidades de posts
│       └── electricity-api.ts  # API de precios
├── .env                    # Variables de entorno
├── next.config.ts          # Configuración de Next.js
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias
```

## Funcionalidades

### Páginas Implementadas

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Homepage con hero y servicios principales | ✅ |
| `/empresas` | Consultoría B2B con 6 servicios | ✅ |
| `/particulares` | Servicios residenciales | ✅ |
| `/estudio` | Wizard de auditoría energética (5 pasos) | ✅ |
| `/contacto` | Formulario con envío de email | ✅ |
| `/blog` | Listado con filtros por categoría | ✅ |
| `/blog/[slug]` | Artículos individuales con SEO | ✅ |
| `/ofertas` | Grid de productos y chollos | ✅ |
| `/luz/precio-hoy` | Dashboard de precios de electricidad | ✅ |

### Componentes Principales

- **Header**: Navegación sticky con menú móvil
- **Footer**: Enlaces, redes sociales y legal
- **WhatsAppWidget**: Botón flotante de contacto
- **ArticleCard**: Tarjetas de blog con categorías
- **EnergyAuditWizard**: Formulario multi-paso
- **ElectricityDashboard**: Visualización de precios

### APIs

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/contacto` | POST | Envío de formulario de contacto |
| `/api/estudio` | POST | Solicitud de estudio energético |

## Primeros Pasos

### Requisitos Previos

- Node.js 18+
- npm, yarn, pnpm o bun

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd webtenseEnergy

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

### Producción

```bash
# Build de producción
npm run build

# Iniciar servidor de producción
npm run start
```

## Configuración

### Variables de Entorno (.env)

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Configuración SMTP (para envío de emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_USER="tu_correo@gmail.com"
SMTP_PASS="tu_contraseña_de_aplicacion"

# WhatsApp (número sin + ni espacios)
NEXT_PUBLIC_WHATSAPP="34691521367"
```

### Configuración de Gmail SMTP

1. Activa la verificación en dos pasos en tu cuenta de Google
2. Ve a [App Passwords](https://myaccount.google.com/apppasswords)
3. Genera una nueva contraseña de aplicación
4. Usa esa contraseña en `SMTP_PASS`

### Integración API ESIOS (Opcional)

Para datos reales de precios de electricidad, regístrate en:
- [REE - ESIOS](https://www.ree.es/es/apidatos)

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción optimizado |
| `npm run start` | Servidor de producción |
| `npm run lint` | Verificación de código con ESLint |

## API Endpoints

### POST /api/contacto

Envía un mensaje desde el formulario de contacto.

**Request:**
```json
{
  "name": "Juan García",
  "email": "juan@email.com",
  "phone": "600123456",
  "subject": "Información general",
  "message": "Me gustaría información sobre..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email enviado correctamente"
}
```

### POST /api/estudio

Envía una solicitud de estudio energético.

**Request:**
```json
{
  "method": "upload",
  "fileName": "factura.pdf",
  "kwConsumed": "250",
  "habits": ["trabajo_casa", "coche_electrico"],
  "contact": {
    "name": "María López",
    "email": "maria@email.com",
    "phone": "600789012",
    "company": "Iberdrola"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Solicitud enviada correctamente"
}
```

## Seguridad

- ✅ Validación de campos obligatorios en formularios
- ✅ Variables de entorno para secretos
- ✅ Cabeceras de seguridad (CSP, XSS protection)
- ⚠️ Recomendado: Implementar rate limiting en producción
- ⚠️ Recomendado: Implementar CSRF protection

## Importar Posts desde WordPress

Si tienes un archivo XML de exportación de WordPress:

```bash
# Generar posts.json desde XML
node scripts/import_wp.js
```

El script parseará el XML y generará `src/data/posts.json`.

## Desarrollo

### Añadir Nuevas Páginas

```bash
# Crear nueva página
src/app/nueva-ruta/page.tsx
```

### Añadir Nuevos Componentes

```bash
# Crear en la carpeta correspondiente
src/components/ui/NuevoComponente.tsx
```

### Usar el Layout Principal

```tsx
// src/app/nueva-ruta/page.tsx
export default function NuevaRutaPage() {
  return (
    <div>
      {/* El Header, Footer y WhatsAppWidget ya están en layout.tsx */}
    </div>
  );
}
```

## Despliegue en VPS (Easypanel)

### Requisitos
- VPS con Docker
- Easypanel instalado
- Dominio configurado (webtenseenergy.com)

### Paso 1: Clonar repositorio en el VPS

```bash
# Conectar al VPS
ssh usuario@tu-servidor.com

# Ir al directorio de apps
cd /opt/apps

# Clonar repositorio
git clone https://github.com/webtense/webtenseenergy.git
cd webtenseenergy
```

### Paso 2: Variables de entorno

```bash
# Crear archivo .env
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=file:./data/webtense.db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=webtense@gmail.com
SMTP_PASS=caeo wstp dcit avkw
EMAIL_FROM=info@webtenseenergy.com
NEXT_PUBLIC_WHATSAPP=34691521367
EOF
```

### Paso 3: Crear volumen para datos

```bash
mkdir -p /opt/apps/webtenseenergy/data
```

### Paso 4: Instalar dependencias y build

```bash
npm install
npm run build
```

### Paso 5: Ejecutar con PM2 (recomendado)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar la app
pm2 start npm --name "webtense-energy" -- start

# Guardar configuración
pm2 save

# Reiniciar al reiniciar el servidor
pm2 startup
```

### Paso 6: Configurar Nginx como proxy reverso

```bash
# Instalar nginx
apt install nginx

# Crear configuración
cat > /etc/nginx/sites-available/webtenseenergy << 'EOF'
server {
    listen 80;
    server_name webtenseenergy.com www.webtenseenergy.com;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Habilitar sitio
ln -s /etc/nginx/sites-available/webtenseenergy /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Paso 7: SSL con Let's Encrypt

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d webtenseenergy.com -d www.webtenseenergy.com
```

### Comandos útiles de gestión

```bash
# Ver logs
pm2 logs webtense-energy

# Reiniciar app
pm2 restart webtense-energy

# Ver estado
pm2 status

# Monitor en tiempo real
pm2 monit
```

## Roadmap

- [ ] Panel de administración con NextAuth
- [ ] CMS para gestionar ofertas dinámicamente
- [ ] Tests E2E con Playwright
- [ ] Tests unitarios con Vitest/Jest
- [ ] Integración con newsletter (Mailchimp/Resend)
- [ ] Soporte PWA
- [ ] Internacionalización (i18n)
- [ ] Dashboard de analytics
- [ ] Integración con API real de ESIOS
- [ ] Sistema de notificaciones push

## Contribuir

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Changelog

### v0.2.0 (2026-04-07)
- ✅ Activado envío real de emails
- ✅ Implementada API de estudio energético
- ✅ Corregidos bugs de lint
- ✅ Funcionalidad WhatsApp con variable de entorno
- ✅ Corregidos botones no funcionales en particulares
- ✅ Corregido slug inválido en blog

### v0.1.0 (2025-06-03)
- ✅ Initial release
- ✅ Homepage con hero y CTAs
- ✅ Páginas B2B y residenciales
- ✅ Wizard de auditoría energética
- ✅ Blog con 17 artículos
- ✅ Dashboard de precios de luz (demo)
- ✅ Formulario de contacto

## Licencia

Privado - WEBTENSE ENERGY © 2024-2026

Todos los derechos reservados. Ninguna parte de este sitio web puede ser reproducida sin permiso expreso.

---

**¿Preguntas?** Abre un issue en el repositorio o contacta a info@webtenseenergy.com
