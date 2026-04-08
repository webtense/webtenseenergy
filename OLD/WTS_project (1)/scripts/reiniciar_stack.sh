#!/bin/bash
echo "🔧 Deteniendo y eliminando contenedores previos..."
docker compose down --remove-orphans
docker container prune -f
echo "🚀 Levantando entorno desde cero..."
docker compose up -d
