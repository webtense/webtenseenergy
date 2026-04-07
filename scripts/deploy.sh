#!/bin/bash
# Script de despliegue para Easypanel/Pinsolucions

set -e

echo "🚀 Desplegando WEBTENSE ENERGY..."

# Variables
APP_NAME="webtense-energy"
SSH_HOST="tu-servidor-pinsolucions.com"
SSH_USER="root"

# 1. Build local
echo "📦 Haciendo build..."
npm run build

# 2. Crear archivo de variables de entorno para producción
echo "⚙️  Creando configuración..."
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3010
DATABASE_URL="file:./data/webtense.db"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="webtense@gmail.com"
SMTP_PASS="caeo wstp dcit avkw"
EMAIL_FROM="info@webtenseenergy.com"
NEXT_PUBLIC_WHATSAPP="34691521367"
EOF

# 3. Empaquetar para despliegue
echo "📁 Empaquetando..."
tar -czvf ${APP_NAME}.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.tar.gz' \
  --exclude='scripts' \
  --exclude='*.md' \
  --exclude='.env' \
  --exclude='.env.example' \
  --exclude='prisma/schema.prisma' \
  .

# 4. Subir al servidor (descomenta y configura)
# echo "📤 Subiendo al servidor..."
# scp ${APP_NAME}.tar.gz ${SSH_USER}@${SSH_HOST}:/opt/apps/

# 5. Instrucciones
echo ""
echo "=========================================="
echo "✅ Build completado!"
echo "=========================================="
echo ""
echo "📋 Pasos para desplegar en Easypanel:"
echo ""
echo "1. Sube el archivo '${APP_NAME}.tar.gz' al servidor"
echo ""
echo "2. En Easypanel, crea una nueva app:"
echo "   - Name: webtense-energy"
echo "   - Image: node:20-alpine"
echo "   - Port: 3010"
echo ""
echo "3. Sube tu .env.production como variable de entorno"
echo ""
echo "4. Monta un volumen para la base de datos:"
echo "   - Path: /app/data"
echo ""
echo "5. El Dockerfile ya está configurado para Next.js"
echo ""
echo "=========================================="
echo ""

# Limpiar
rm -f ${APP_NAME}.tar.gz .env.production
