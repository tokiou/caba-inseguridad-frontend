# Design: Autenticación JWT

**Change:** auth-jwt

---

## Contrato del backend (resumen)

Base URL dev: `http://localhost:8080/api/v1`. Errores siempre con shape `{ error, message }`.

| Método | Ruta             | Body                  | Cookie        | Respuesta 2xx                                              |
|--------|------------------|-----------------------|---------------|-----------------------------------------------------------|
| POST   | `/auth/register` | `{email, password}`   | —             | `201 {id, email}`                                         |
| POST   | `/auth/login`    | `{email, password}`   | setea refresh | `200 {access_token, token_type:"bearer", expires_in:900}` |
| POST   | `/auth/refresh`  | (vacío)               | lee + rota    | `200 {access_token, token_type, expires_in}`              |
| POST   | `/auth/logout`   | (vacío)               | lee + borra   | `200 {message}`                                           |
| GET    | `/auth/me`       | —                     | (Bearer)      | `200 {id, email}`                                         |
| GET    | `/routes/safe`   | (query params)        | (Bearer)      | `200 {routes...}`                                         |

- `password` mínimo **8 caracteres**.
- `login`, `refresh` y `logout` usan la cookie → **`credentials: 'include'`** obligatorio.
- `register` NO setea cookie → no necesita credenciales.
- `/routes/safe` es el único endpoint de negocio protegido hoy.

## Decisiones técnicas

### 1. Access token en memoria de módulo, no en estado React ni storage

El access token vive en `let accessToken: string | null` dentro de `authService.ts`. Motivos:

- **No `localStorage`/`sessionStorage`:** un XSS no puede leerlo. Esa es la razón de existir del
  esquema cookie-HttpOnly + memoria.
- **No en `authStore` (Zustand):** el store puede inspeccionarse por devtools y tiende a
  serializarse. El token es un secreto efímero, no estado de UI. El store guarda solo `user` y
  `status`.
- **Trade-off aceptado:** un F5 borra el token; se recupera con `refresh()` al bootstrap.

### 2. `authFetch` con auto-refresh single-flight

Ante `401`, `authFetch` llama `refresh()` y reintenta **una sola vez**. Para evitar tormentas de
refresh cuando varias requests fallan a la vez, `refresh()` es **single-flight**: si ya hay un
refresh en vuelo, las llamadas concurrentes esperan la misma promesa.

```
let refreshPromise: Promise<boolean> | null = null
function refresh() {
  if (!refreshPromise) refreshPromise = doRefresh().finally(() => { refreshPromise = null })
  return refreshPromise
}
```

Si el refresh falla (`invalid_refresh`), se limpia el token, el store pasa a `anonymous` y el error
se propaga: la UI manda a login. No se reintenta el refresh.

### 3. Bootstrap de sesión

`authStore.status` arranca en `booting`. Al montar la app se llama `refresh()`:
- **ok** → `getMe()` → `setUser(me)`, `status = authenticated`.
- **falla** → `status = anonymous` (sin error visible: simplemente no había sesión).

Mientras `booting`, se muestra un splash y no se renderiza el shell para evitar disparar `useRoute`
sin sesión.

### 4. Endpoint protegido vía `authFetch`

`fetchSafeRoutes` reemplaza `fetch` por `authFetch`. El parseo del envelope de error y
`SafeRoutesError` se conservan. Un `401` que sobreviva al auto-refresh llega como
`unauthorized` y la UI lo trata como "sesión expirada → login".

### 5. CORS / credenciales

- Dev server en `http://localhost:8081` (único origin permitido por el backend hoy). Ya configurado
  en `package.json` (`vite --port 8081 --strictPort`).
- `credentials: 'include'` en `login`, `refresh`, `logout` (y se deja en `authFetch` para que la
  cookie viaje también en las requests protegidas, inocuo si no hay cookie de sesión cross-site).
- `register` no necesita credenciales pero es inocuo incluirlas.

## Mapeo de códigos de error → acción en el front

| HTTP | error                 | Acción en el front                                  |
|------|-----------------------|-----------------------------------------------------|
| 400  | `invalid_request`     | Mostrar error de validación del formulario          |
| 401  | `invalid_credentials` | "Email o contraseña inválidos"                      |
| 401  | `invalid_refresh`     | Limpiar sesión → mandar a login                     |
| 401  | `unauthorized`        | Disparar refresh + retry (lo hace `authFetch`)      |
| 403  | `account_inactive`    | "Tu cuenta está desactivada", no reintentar         |
| 409  | `email_taken`         | "Ese email ya está registrado"                      |

## Variables de entorno (lado backend, el front solo las conoce)

- `ACCESS_TOKEN_TTL_MINUTES=15` (= `expires_in` 900s), `REFRESH_TOKEN_TTL_DAYS=7`.
- Dev: `COOKIE_SECURE=false`, `COOKIE_SAMESITE=lax` (same-site, distinto puerto → cross-origin, por
  eso CORS + credentials alcanzan).
- Prod: dominios distintos de verdad → `COOKIE_SAMESITE=none` + `COOKIE_SECURE=true` (HTTPS), y
  agregar el origin real a `AllowedOrigins` del backend.

## Archivos afectados

- `src/services/authService.ts` (nuevo): cliente + token en memoria + `authFetch`.
- `src/types/auth.ts` (nuevo): `User`, `AuthTokens`, `AuthErrorCode`.
- `src/store/authStore.ts` (nuevo): `user`, `status`, acciones.
- `src/services/routeService.ts` (mod): `fetchSafeRoutes` usa `authFetch`.
- `src/components/auth/` (nuevo): `LoginModal`/`AuthGate`, formularios login + registro.
- `src/components/layout/TopBar.tsx` (mod): indicador de usuario + logout.
- `src/App.tsx` / `src/main.tsx` (mod): bootstrap + gate de `booting`.
