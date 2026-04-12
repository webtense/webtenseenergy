# Runbook de Backup y Rollback

## Objetivo

Tener una secuencia operativa corta y repetible para backup, despliegue, validacion y rollback en caso de incidencia.

## Antes de desplegar

1. Confirmar CI verde
2. Confirmar imagen publicada en GHCR
3. Confirmar variables correctas en EasyPanel
4. Tomar backup logico de PostgreSQL

## Backup recomendado

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%F-%H%M%S).sql
```

## Secuencia de despliegue

1. Desplegar nueva imagen en EasyPanel
2. Ejecutar migraciones necesarias
3. Ejecutar `npm run db:seed-admin` si es primer bootstrap
4. Validar rutas publicas y admin
5. Revisar logs de aplicacion

## Checklist de validacion

- Home responde 200
- Blog lista posts
- Contacto acepta envio
- Estudio acepta envio con y sin adjunto valido
- Admin login funciona
- Dashboard admin carga posts, deals, leads y estudios
- `/api/precios-luz` responde sin 5xx

## Rollback de aplicacion

1. En EasyPanel, volver a la imagen previa estable
2. Reiniciar servicio
3. Revalidar rutas criticas

## Rollback de datos

Solo si la incidencia proviene de una migracion incompatible:

1. Detener escrituras en la app
2. Restaurar backup SQL previo
3. Replegar imagen compatible con ese esquema

## Criterio de decision

- Si el fallo es solo de UI o routing: rollback de imagen
- Si el fallo es de esquema/migracion: rollback de BD + imagen
- Si el fallo es de variables: corregir variables y redesplegar sin restaurar BD

## Evidencias a guardar

- SHA desplegado
- Hora del despliegue
- Resultado del backup
- Resultado de validacion manual
- Motivo del rollback, si aplica
