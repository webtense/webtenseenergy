#!/bin/bash
echo "🛑 Deteniendo y eliminando servicio systemd..."
sudo systemctl stop wts.service
sudo systemctl disable wts.service
sudo rm /etc/systemd/system/wts.service
sudo systemctl daemon-reload
echo "✅ Servicio eliminado."
