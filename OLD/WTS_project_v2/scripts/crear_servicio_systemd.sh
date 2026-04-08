#!/bin/bash
cat <<EOF | sudo tee /etc/systemd/system/wts.service
[Unit]
Description=WTS Docker Stack
After=network.target docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/root/WTS
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable wts.service
echo "✅ Servicio creado y habilitado."
