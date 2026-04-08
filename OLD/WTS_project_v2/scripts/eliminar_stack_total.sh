#!/bin/bash
echo "🧹 Eliminando todos los contenedores, volúmenes y redes relacionados..."
docker compose down -v --remove-orphans
docker volume prune -f
docker network prune -f
docker container prune -f
