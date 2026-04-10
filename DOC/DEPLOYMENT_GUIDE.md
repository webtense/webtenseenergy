# Guía de Despliegue - DEPLOYMENT GUIDE

## Prerequisites

- Docker instalado
- Acceso a EasyPanel
- Acceso a PostgreSQL (EasyPanel)
- Acceso a GHCR o registry privado

---

## Pasos de Despliegue

### 1. Preparar Entorno

```bash
# Clonar repositorio
git clone https://github.com/webtense/webtenseenergy.git
cd webtenseenergy

# Instalar dependencias
npm install
```

### 2. Generar Prisma Client

```bash
npm run db:generate
```

### 3. Build Docker

```bash
docker build --platform linux/amd64 -t ghcr.io/webtense/webtenseenergy/webtense-energy:latest .
```

### 4. Push a Registry

```bash
# GHCR (requiere autenticación)
docker push ghcr.io/webtense/webtenseenergy/webtense-energy:latest

# O registry local (EasyPanel)
docker tag ghcr.io/webtense/webtenseenergy/webtense-energy:latest 217.154.188.166:5000/webtense-energy:latest
docker push 217.154.188.166:5000/webtense-energy:latest
```

### 5. Configurar EasyPanel

#### a) Crear Base de Datos

1. Acceder a EasyPanel → Databases
2. Crear PostgreSQL database: `webtense_energy`
3. Anotar credentials (host, port, user, password)

#### b) Crear Servicio

1. Services → Add Service
2. Seleccionar "Custom Docker"
3. Configurar:
   - Image: `ghcr.io/webtense/webtenseenergy/webtense-energy:latest`
   - Port: `3010`
   - Environment variables:
     ```
     DATABASE_URL=postgresql://user:password@host:5432/webtense_energy
     ADMIN_SECRET=your-secure-secret
     ```

#### c) Configurar Dominio

1. Domains → Add Domain
2. Añadir `webtenseenergy.com`
3. Configurar SSL (Let's Encrypt automático)

---

## Variables de Entorno

| Variable | Requerido | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | Connection string PostgreSQL |
| `ADMIN_SECRET` | Sí | Secret para sesiones admin |
| `NODE_ENV` | No | production/development |
| `OPENROUTER_API_KEY` | No | Para IA (opcional) |

### Formato DATABASE_URL

```
postgresql://username:password@host:port/database?schema=public
```

Ejemplo:
```
postgresql://app_user:strong_password@db.internal:5432/webtense_energy?schema=public
```

---

## Verificación

### Test Local

```bash
# Iniciar contenedor
docker run -d -p 3000:3010 \
  -e DATABASE_URL="postgresql://..." \
  -e ADMIN_SECRET="test" \
  ghcr.io/webtense/webtenseenergy/webtense-energy:latest

# Verificar
curl http://localhost:3000
curl http://localhost:3000/api/public/feature-flags
```

### Test Production

```bash
# Verificar homepage
curl https://webtenseenergy.com

# Verificar API
curl https://webtenseenergy.com/api/public/feature-flags
```

---

## Troubleshooting

### Container no inicia

```bash
# Ver logs
docker logs webtense-energy

# Verificar variables
docker exec webtense-energy env
```

### Error de conexión DB

1. Verificar DATABASE_URL correcto
2. Verificar PostgreSQL accesible
3. Verificar credentials

```bash
# Test conexión
docker exec webtense-energy sh -c "apt-get install -y postgresql-client && psql \$DATABASE_URL"
```

### API returns 404

1. Verificar Traefik routing
2. Verificar puerto correcto (3010)
3. Verificar dominio configurado

### SSL/HTTPS no funciona

1. Verificar certificados en EasyPanel
2. Verificar dominio apuntando correctamente
3. Check Let's Encrypt status

---

## Mantenimiento

### Actualizar Imagen

```bash
# Build nueva imagen
docker build -t ghcr.io/webtense/webtenseenergy/webtense-energy:latest .

# Push
docker push ghcr.io/webtense/webtenseenergy/webtense-energy:latest

# Restart en EasyPanel
# O:
docker pull ghcr.io/webtense/webtenseenergy/webtense-energy:latest
docker restart webtense-energy
```

### Backup Database

```bash
# EasyPanel provides automated backups
# O manual:
pg_dump -h host -U user -d webtense_energy > backup.sql
```

### Logs

```bash
# Ver logs contenedor
docker logs -f webtense-energy

# Ver logs en EasyPanel
# Dashboard → Logs
```

---

## Seguridad Post-Deploy

1. **Rotar credenciales**: Cambiar ADMIN_SECRET
2. **Configurar firewall**: Restringir puertos
3. ** SSL**: Verificar certificado válido
4. **Monitoreo**: Configurar alertas

---

## Scripts Útiles

### Seed Admin User

```javascript
// scripts/seed-admin.mjs
import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

const email = 'admin@webtenseenergy.com';
const password = 'ChangeMe123!';
const passwordHash = await bcrypt.hash(password, 10);

await db.adminUser.create({
  data: {
    email,
    passwordHash,
    name: 'Admin',
    role: 'ADMIN'
  }
});
```

### Restart Service

```bash
docker restart webtense-energy
```

---

## Contacto Soporte

- Email: info@webtenseenergy.com
- Telegram: @webtenseenergy
- WhatsApp: +34691521367
