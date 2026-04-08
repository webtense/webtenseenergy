# Accesos y actualizacion operativa

Este documento usa variables guardadas en `.env.accesos` para no exponer claves en scripts ni en comandos sueltos.

## 1) Cargar variables

```bash
set -a
source .env.accesos
set +a
```

## 2) Entrar por SSH al servidor

```bash
sshpass -p "$SERVER_PASSWORD" ssh -p "$SERVER_SSH_PORT" "$SERVER_USER@$SERVER_HOST"
```

## 3) Ver estado rapido del servidor

```bash
sshpass -p "$SERVER_PASSWORD" ssh -p "$SERVER_SSH_PORT" "$SERVER_USER@$SERVER_HOST" "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'"
```

## 4) Frontend y panel

- EasyPanel: `$EASYPANEL_URL`
- Frontend actual publicado: `$FRONTEND_ACTUAL_URL`
- Nuevo puerto configurado en repo: `$FRONTEND_NUEVO_PUERTO`

## 5) Flujo recomendado de actualizacion

1. Confirmar cambios locales y hacer push a `main`.
2. Entrar en EasyPanel con `$EASYPANEL_USER`.
3. Abrir el servicio de `webtense-energy` y ejecutar `Deploy latest`.
4. Validar que la app responde en el puerto/configuracion activos.

## 6) Verificar despliegue tras actualizar

```bash
sshpass -p "$SERVER_PASSWORD" ssh -p "$SERVER_SSH_PORT" "$SERVER_USER@$SERVER_HOST" "docker service ls && docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'"
```

## 7) Nota de seguridad

- `.env.accesos` queda ignorado por Git por la regla `.env*` del `.gitignore`.
- No copies este archivo en tickets, chats o commits.
