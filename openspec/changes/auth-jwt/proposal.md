# Proposal: Autenticación JWT (access en memoria + refresh en cookie HttpOnly)

**Change:** auth-jwt
**Status:** proposed
**Branch:** feat/auth-jwt

---

## Intent

El backend agregó autenticación. El frontend debe poder registrar usuarios, iniciar sesión,
mantener la sesión viva entre recargas y enviar el endpoint protegido `GET /api/v1/routes/safe`
con credenciales válidas. El modelo de seguridad es el estándar **access token corto en memoria +
refresh token largo en cookie HttpOnly**:

- **Access token (JWT, 15 min / `expires_in` 900s):** vive **solo en memoria** del front (nunca
  `localStorage` ni `sessionStorage` — evita robo por XSS). Se manda en `Authorization: Bearer`.
- **Refresh token (7 días):** cookie **HttpOnly** que el navegador maneja solo; **JS nunca la toca**.
  Cuando el access vence, se pega a `POST /auth/refresh` (que lee la cookie) y se obtiene uno nuevo.
- **Bootstrap:** como el access vive en memoria, un F5 lo borra; al arrancar la app se intenta
  `refresh()` una vez para recuperar la sesión vía cookie sin volver a pedir contraseña.

## Scope

**Incluye:**

- Cliente de auth (`services/authService.ts`): `register`, `login`, `refresh`, `logout`, `getMe`,
  más un `authFetch` con auto-refresh ante 401 (reintenta una vez).
- Almacén del access token **en memoria de módulo** (no en estado de React ni storage).
- `authStore` (Zustand) con `user`, `status` (`booting|anonymous|authenticated`) y acciones.
- Bootstrap al arranque: `refresh()` → si ok, `getMe()` y poblar `authStore`.
- `routeService.fetchSafeRoutes` migrado a `authFetch` (endpoint protegido con Bearer).
- UI mínima: modal/pantalla de login + registro, indicador de usuario y logout en la TopBar.
- Manejo del envelope de error `{ error, message }` con los códigos documentados
  (`invalid_request`, `invalid_credentials`, `invalid_refresh`, `unauthorized`,
  `account_inactive`, `email_taken`).
- Config de CORS del lado front: dev server en `http://localhost:8081` (ya fijado en `package.json`)
  y `credentials: 'include'` en toda llamada que use la cookie (login, refresh, logout).

**No incluye:**

- Recuperación de contraseña / verificación de email / OAuth social.
- Roles ni permisos (el backend hoy solo distingue activo/inactivo).
- Persistencia del access token entre pestañas o su renovación proactiva por timer (se renueva
  reactivamente ante 401; un refresh proactivo queda fuera).
- Cambios en el backend (CORS, TTLs y flags de cookie son configuración del backend).

## Approach

- **Access token en memoria de módulo** (`let accessToken: string | null` dentro de
  `authService.ts`), expuesto solo vía `getAccessToken()` / `setAccessToken()` internos. Nunca se
  serializa.
- **`authFetch(path, init)`**: agrega `Authorization: Bearer` si hay token; ante `401` con código
  `unauthorized`/`invalid_token`, llama `refresh()` una vez y reintenta. Si el refresh falla, limpia
  el token, pasa el `authStore` a `anonymous` y propaga el error para que la UI mande a login.
- **`refresh()` / `login()` / `logout()`** usan `credentials: 'include'` para que viaje la cookie.
  `register()` no la necesita (no setea cookie).
- **`authStore`** mantiene el `user` (`{id,email}`) y el `status`; el access token NO vive acá (vive
  en el módulo) para no exponerlo a devtools/serialización.
- **Bootstrap** en `main.tsx` (o un `<AuthBootstrap>` en `App`): estado inicial `booting`, se llama
  `refresh()`; si devuelve true se hace `getMe()` y se pasa a `authenticated`, si no a `anonymous`.
  Mientras `booting` se muestra un splash mínimo.
- **`fetchSafeRoutes`** pasa a usar `authFetch` en lugar de `fetch` directo; el manejo de
  `SafeRoutesError` se conserva. Si `authFetch` no puede autenticar, `useRoute` no dispara y la UI
  pide login.
- **UI**: `AuthGate`/`LoginModal` con formularios React Hook Form + Zod (password ≥ 8). Indicador de
  usuario + botón logout en `TopBar`.
