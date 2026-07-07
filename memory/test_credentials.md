# Credenciales de prueba — SchoolPay RD (MVP demo, sin backend)

## Login demo (único acceso)
- URL: /login
- Email: `admin@schoolpayrd.com`
- Password: `Admin123!`

La sesión es simulada y se guarda en `localStorage` (clave `schoolpay-rd-session`).
Sin sesión activa, cualquier ruta bajo `/_shell` (dashboard, estudiantes, pagos, etc.) redirige a `/login`.
"Cerrar sesión" (sidebar) limpia la sesión y vuelve a `/login`.

## Datos
Todo el estado (estudiantes, pagos, mensualidades) vive en `localStorage`
(clave `schoolpay-rd-state-v1`). Para reiniciar: borrar esa clave o el localStorage.
