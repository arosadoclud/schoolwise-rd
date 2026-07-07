# SchoolPay RD — PRD / Bitácora

## Problema original
Mejorar el MVP (TanStack Start + React + TS, datos mock) haciendo funcionales los botones
principales usando estado local, SIN backend ni Supabase. No cambiar el diseño.

## Arquitectura
- Frontend: TanStack Start (SSR) + React 19 + Tailwind v4 + shadcn/ui.
- Estado local compartido en `/app/src/lib/store.ts` vía `useSyncExternalStore`, persistido en
  `localStorage` (clave `schoolpay-rd-state-v1`). Semilla desde `mock-data.ts`.
- Sesión demo simulada en `/app/src/lib/session.ts` (`localStorage` clave `schoolpay-rd-session`).
- Servidor dev: vite forzado a puerto 8080 (config Lovable). `/app/scripts/dev-with-proxy.cjs`
  levanta vite + proxy TCP 3000->8080; lanzado por supervisor `frontend` (`/app/frontend/package.json`).
  `vite.config.ts` añade `server.allowedHosts: true` para el host del preview.

## Implementado (2026-07-07)
- [x] (1) Nuevo estudiante: modal con formulario -> agrega a la tabla.
- [x] (2) Editar estudiante: modal precargado -> actualiza.
- [x] (3) Eliminar estudiante: AlertDialog de confirmación antes de borrar.
- [x] (4) Registrar pago: modal (estudiante, concepto, método, monto, banco, referencia) -> guarda local.
- [x] (5) Pago validado reduce visualmente el balance del estudiante.
- [x] (6) Generar mensualidades del mes: crea registros reales en memoria, solo activos sin mensualidad
      del mes actual (idempotente); también incrementa balance del estudiante.
- [x] (7) Protección de rutas: sin sesión, `/_shell/*` redirige a `/login`. Logout en sidebar limpia sesión.
- [x] (8) Todo local/mock, persistido en localStorage. (9) Diseño intacto.
- Testing agent: 11/11 escenarios PASS.

## Credenciales demo
admin@schoolpayrd.com / Admin123!  (ver /app/memory/test_credentials.md)

## Backlog / próximos pasos
- P1: Conectar backend real (FastAPI + Mongo) reemplazando el store local.
- P2: CRUD funcional en el resto de módulos (padres, cursos, conceptos, gastos, acuerdos, inscripciones).
- P2: Validación/anulación de pagos pendientes; edición de mensualidades y registro de mora automática.
- P3: Investigar (baja prioridad) el warning de hidratación `data-tsd-source` en __root.tsx (tooling Lovable, no bloqueante).
