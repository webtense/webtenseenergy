#!/bin/bash
# ===========================================
# DESPLIEGUE MANUAL - WEBTENSE ENERGY
# Para ejecutar en el terminal de Easypanel
# ===========================================

set -e

echo "🚀 Iniciando despliegue de WEBTENSE ENERGY..."

# Variables
APP_DIR="/app/webtense"
REPO_URL="https://github.com/webtense/webtenseenergy.git"
PORT=3010

# 1. Crear directorio
echo "📁 Creando directorio..."
mkdir -p $APP_DIR/data
cd $APP_DIR

# 2. Clonar repositorio (si no existe)
if [ ! -d ".git" ]; then
    echo "📥 Clonando repositorio..."
    rm -rf * 2>/dev/null || true
    git clone $REPO_URL .
else
    echo "📦 Actualizando repositorio..."
    git pull origin main
fi

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 4. Build
echo "🔨 Haciendo build..."
npm run build

# 5. Crear .env si no existe
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo .env..."
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
fi

# 6. Crear directorio de datos
echo "📂 Asegurando directorio de datos..."
mkdir -p data

echo ""
echo "✅ DESPLIEGUE COMPLETADO"
echo "============================"
echo "La aplicación está lista para ejecutar."
echo "Para iniciar: PORT=$PORT npm start"
echo ""
