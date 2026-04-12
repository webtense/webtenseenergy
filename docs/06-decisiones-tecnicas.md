# Decisiones Tecnicas WebTenseEnergy v2.0

## DT-001: Mantener monolito modular con Next.js App Router

- Estado: aprobada
- Motivo: el producto necesita velocidad de iteracion, despliegue simple y un backend acoplado al frontend, no una descomposicion en microservicios.
- Consecuencia: la logica se modulariza dentro del repo, pero no se fragmenta en runtimes separados.

## DT-002: PostgreSQL como unica fuente oficial de datos

- Estado: aprobada
- Motivo: el schema actual, el runtime y la operacion ya apuntan a Postgres.
- Consecuencia: toda referencia a SQLite debe retirarse del camino principal y de la documentacion activa.

## DT-003: Auth admin propia endurecida antes que introducir una libreria nueva

- Estado: aprobada
- Motivo: ya existe un sistema minimo funcional con `bcryptjs`, cookies `HttpOnly` y firma HMAC.
- Consecuencia: primero se consolidan sesion, guards y RBAC. Solo se reevaluara una libreria externa si hay una necesidad concreta que justifique la migracion.

## DT-004: `docs/` sera la unica fuente oficial de documentacion activa

- Estado: aprobada
- Motivo: el repo tiene documentacion duplicada en `DOC/`, `docs/` y ficheros sueltos.
- Consecuencia: la documentacion obsoleta se archivara o se marcara como no canonica.

## DT-005: GitHub -> GHCR/EasyPanel sera el flujo de despliegue oficial

- Estado: aprobada
- Motivo: el objetivo es un despliegue reproducible, auditable y sin pasos manuales ocultos.
- Consecuencia: `rsync`, `.env` remoto escrito por script y `pm2` quedan fuera del flujo principal.

## DT-006: `OLD/` no formara parte del flujo activo

- Estado: aprobada
- Motivo: contiene historico util, pero ensucia el repo operativo y dificulta mantenimiento.
- Consecuencia: el contenido se conserva en `archive/old-assets` y se retirara de la rama de trabajo principal.

## DT-007: Blog publico con estrategia DB-first y fallback temporal

- Estado: aprobada
- Motivo: ya existe una transicion parcial desde `src/data/posts.json` a Prisma.
- Consecuencia: el fallback se mantiene solo para evitar ruptura durante la migracion; no es el estado final.

## DT-008: Cada fase debe dejar artefactos verificables

- Estado: aprobada
- Motivo: reducir trabajo invisible y deuda de contexto.
- Consecuencia: cada fase debe cerrar con codigo, documentacion, criterios de validacion y riesgos pendientes.

## DT-009: Variables por nombre, nunca secretos por valor

- Estado: aprobada
- Motivo: el repo debe ser seguro y reproducible.
- Consecuencia: `.env.example`, docs y configuraciones solo reflejaran nombres y contratos de variables.

## DT-010: Congelado de `v1.0` requiere resolver el cambio local actual

- Estado: pendiente operativa
- Motivo: el arbol de trabajo contiene una modificacion local en `src/components/pages/OfertasPage.tsx`.
- Consecuencia: el tag `v1.0-baseline` no se crea hasta decidir si ese cambio entra en el baseline o queda fuera.
