# n8n Webtense

## Estado objetivo

El workflow operativo de n8n para Webtense debe vivir versionado en el repo y no debe almacenar el bearer del backend pegado en el nodo HTTP.

Artefacto canonico:

- `src/n8n/webtense.workflow.json`

## Que hace

- Trigger manual para pruebas ad hoc.
- Trigger programado diario a las `08:00` en `Europe/Madrid`.
- Webhook de smoke test en `/webhook/webtense-test`.
- Llamada `POST https://webtenseenergy.com/api/automation/daily`.
- La automatizacion diaria del backend procesa ofertas, publica avisos de blog nuevos en Telegram, lanza newsletter cuando toca y resume leads/estudios.

Payload por defecto:

```json
{
  "dryRun": false,
  "forceNewsletter": false
}
```

## Credencial requerida en n8n

Crear una credencial de tipo `httpHeaderAuth` con estos valores:

- Nombre: `webtense-cron-secret`
- Header: `Authorization`
- Valor: `Bearer <CRON_SECRET>`

`<CRON_SECRET>` debe ser exactamente el mismo valor configurado en produccion para la app Webtense.

## Importacion y activacion

1. Importar `src/n8n/webtense.workflow.json` en n8n.
2. Abrir el nodo `Run Webtense Daily Automation`.
3. Asignar la credencial `webtense-cron-secret`.
4. Verificar que la URL sea `https://webtenseenergy.com/api/automation/daily`.
5. Activar el workflow.

## Validacion operativa

1. Ejecutar `Manual Trigger` y comprobar HTTP `200`.
2. Probar `https://n8n.boitaullresort.com/webhook/webtense-test`.
3. Verificar que la respuesta incluya `ok: true`.
4. Revisar que no existan advertencias de secreto hardcodeado en el nodo HTTP.

## Notas

- El backend ya protege la ruta con `CRON_SECRET` en `src/lib/machine-auth.ts`.
- La ruta acepta `dryRun` y `forceNewsletter` desde `src/app/api/automation/daily/route.ts`.
- Los posts del blog se envian a Telegram solo si estan `PUBLISHED`, no pertenecen a la categoria `Ofertas` y no existe ya un `TelegramLog` exitoso con accion `automation_blog_post_sent`.
- Si se vuelve a exportar el workflow desde n8n, el JSON nuevo debe sustituir al archivo versionado en el repo.
