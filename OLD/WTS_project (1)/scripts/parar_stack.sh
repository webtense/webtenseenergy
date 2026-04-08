#!/bin/bash
echo "🛑 Deteniendo el stack sin eliminar volúmenes..."
docker compose down --remove-orphans
echo "✅ Stack detenido, volúmenes y datos preservados."
