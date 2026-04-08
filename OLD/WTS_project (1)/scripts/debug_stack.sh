#!/bin/bash
echo "📋 Contenedores activos:"
docker ps

echo "📝 Logs de nginx-proxy:"
docker logs nginx-proxy --tail=50

echo "🔍 Estado de volúmenes:"
docker volume ls

echo "🌐 Estado de redes:"
docker network ls
