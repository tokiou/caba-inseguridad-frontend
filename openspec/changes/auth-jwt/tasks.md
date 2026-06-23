# Tasks: auth-jwt

## Tipos y servicio

- [ ] `types/auth.ts`: `User {id,email}`, `LoginResponse {access_token, token_type, expires_in}`,
      `AuthErrorCode`.
- [ ] `services/authService.ts`:
  - [ ] `accessToken` en memoria de módulo + `getAccessToken`/`setAccessToken` internos.
  - [ ] `register(email, password)` → `POST /auth/register`.
  - [ ] `login(email, password)` → `POST /auth/login` con `credentials: 'include'`; guarda token.
  - [ ] `refresh()` single-flight → `POST /auth/refresh` con `credentials: 'include'`.
  - [ ] `logout()` → `POST /auth/logout` con `credentials: 'include'`; limpia token.
  - [ ] `getMe()` → `GET /auth/me` vía `authFetch`.
  - [ ] `authFetch(path, init)` con auto-refresh + retry único ante 401.
  - [ ] `AuthError` tipado (code, message) + parseo del envelope `{error, message}`.

## Estado

- [ ] `store/authStore.ts`: `user`, `status (booting|anonymous|authenticated)`, `setUser`,
      `setAnonymous`, `setAuthenticated`.
- [ ] Conectar `authService` ↔ `authStore` (login/logout/refresh actualizan el store).

## Bootstrap

- [ ] En `App`/`main.tsx`: al montar, `status=booting`, llamar `refresh()`; ok → `getMe()` →
      `authenticated`; falla → `anonymous`.
- [ ] Splash mientras `booting`; no renderizar shell ni disparar `useRoute`.

## Endpoint protegido

- [ ] `routeService.fetchSafeRoutes` usa `authFetch` en vez de `fetch`.
- [ ] `useRoute` solo `enabled` cuando `status === 'authenticated'`.

## UI

- [ ] `components/auth/LoginModal.tsx` (login + registro, tabs/toggle) con React Hook Form + Zod
      (password ≥ 8).
- [ ] `AuthGate`: si `anonymous`, mostrar login; si `authenticated`, el shell.
- [ ] `TopBar`: indicador de email + botón logout.
- [ ] Mapear códigos de error a mensajes accionables (ver design.md).

## Verificación

- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] Verificar manualmente: register → login → F5 mantiene sesión → ruta protegida funciona →
      logout vuelve a login.
