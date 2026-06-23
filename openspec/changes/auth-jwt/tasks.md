# Tasks: auth-jwt

## Tipos y servicio

- [x] `types/auth.ts`: `User {id,email}`, `LoginResponse {access_token, token_type, expires_in}`,
      `AuthErrorCode`.
- [x] `services/authService.ts`:
  - [x] `accessToken` en memoria de módulo + `getAccessToken`/`setAccessToken` internos.
  - [x] `register(email, password)` → `POST /auth/register`.
  - [x] `login(email, password)` → `POST /auth/login` con `credentials: 'include'`; guarda token.
  - [x] `refresh()` single-flight → `POST /auth/refresh` con `credentials: 'include'`.
  - [x] `logout()` → `POST /auth/logout` con `credentials: 'include'`; limpia token.
  - [x] `getMe()` → `GET /auth/me` vía `authFetch`.
  - [x] `authFetch(path, init)` con auto-refresh + retry único ante 401.
  - [x] `AuthError` tipado (code, message) + parseo del envelope `{error, message}`.

## Estado

- [x] `store/authStore.ts`: `user`, `status (booting|anonymous|authenticated)`, `setUser`,
      `setAnonymous`, `setAuthenticated`.
- [x] Conectar `authService` ↔ `authStore` (login/logout/refresh actualizan el store).

## Bootstrap

- [x] En `App`/`main.tsx`: al montar, `status=booting`, llamar `refresh()`; ok → `getMe()` →
      `authenticated`; falla → `anonymous`.
- [x] Splash mientras `booting`; no renderizar shell ni disparar `useRoute`.

## Endpoint protegido

- [x] `routeService.fetchSafeRoutes` usa `authFetch` en vez de `fetch`.
- [x] `useRoute` solo `enabled` cuando `status === 'authenticated'`.

## UI

- [x] `components/auth/LoginModal.tsx` (login + registro, tabs/toggle) con React Hook Form + Zod
      (password ≥ 8).
- [x] `AuthGate`: si `anonymous`, mostrar login; si `authenticated`, el shell.
- [x] `TopBar`: indicador de email + botón logout.
- [x] Mapear códigos de error a mensajes accionables (ver design.md).

## Verificación

- [x] `npm run lint` y `npm run build` sin errores.
- [ ] Verificar manualmente con el backend corriendo: register → login → F5 mantiene sesión →
      ruta protegida funciona → logout vuelve a login. (Pendiente: requiere backend en :8080.)
