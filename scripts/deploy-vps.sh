#!/bin/bash
# ===========================================
# SCRIPT DE DESPLIEGUE - WEBTENSE ENERGY
# Para VPS con Easypanel/Pinsolucions
# ===========================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  WEBTENSE ENERGY - DESPLIEGUE${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Preguntar datos
read -p "Dirección del servidor (IP o dominio): " SERVER
read -p "Usuario SSH: " SSH_USER
read -p "Ruta donde instalar [/opt/apps/webtense]: " APP_PATH

# Valores por defecto
APP_PATH=${APP_PATH:-/opt/apps/webtense}

echo ""
echo -e "${YELLOW}Configuración:${NC}"
echo "  Servidor: $SERVER"
echo "  Usuario: $SSH_USER"
echo "  Ruta: $APP_PATH"
echo ""

read -p "¿Continuar? (s/n): " CONFIRM
if [ "$CONFIRM" != "s" ]; then
    echo "Despliegue cancelado."
    exit 1
fi

# Crear directorio remoto
echo -e "${GREEN}📁 Creando directorio en el servidor...${NC}"
ssh $SSH_USER@$SERVER "mkdir -p $APP_PATH/webtenseenergy/data"

# Copiar archivos (excluyendo node_modules, .git, etc.)
echo -e "${GREEN}📤 Subiendo archivos...${NC}"
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='.next' \
    --exclude='*.log' --exclude='.env' \
    ./ $SSH_USER@$SERVER:$APP_PATH/webtenseenergy/

# Crear .env en el servidor
echo -e "${GREEN}⚙️  Configurando variables de entorno...${NC}"
ssh $SSH_USER@$SERVER "cat > $APP_PATH/webtenseenergy/.env << 'EOF'
NODE_ENV=production
PORT=3010
DATABASE_URL=file:./data/webtense.db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=webtense@gmail.com
SMTP_PASS=caeo wstp dcit avkw
EMAIL_FROM=info@webtenseenergy.com
NEXT_PUBLIC_WHATSAPP=34691521367
EOF"

# Instalar dependencias y build
echo -e "${GREEN}📦 Instalando dependencias y haciendo build...${NC}"
ssh $SSH_USER@$SERVER "cd $APP_PATH/webtenseenergy && npm install && npm run build"

# Configurar PM2
echo -e "${GREEN}🚀 Configurando PM2...${NC}"
ssh $SSH_USER@$SERVER "cd $APP_PATH/webtenseenergy && npm install -g pm2 && pm2 start npm --name 'webtense-energy' -- start -- -p 3010 && pm2 save && pm2 startup"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ DESPLIEGUE COMPLETADO${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "La app está corriendo en:"
echo -e "  ${YELLOW}http://$SERVER:3010${NC}"
echo ""
echo -e "Para configurar dominio:"
echo -e "  1. Configurar Nginx como proxy reverso"
echo -e "  2. Instalar SSL con certbot"
echo ""
echo -e "Comandos útiles:"
echo -e "  ssh $SSH_USER@$SERVER 'pm2 logs webtense-energy'"
echo -e "  ssh $SSH_USER@$SERVER 'pm2 restart webtense-energy'"
echo ""
