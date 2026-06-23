# Delta Spec: Routing — endpoint protegido con Bearer

Domain: **routing**

---

## MODIFIED Requirements

### Requirement: Safe routes fetch contra `/api/v1/routes/safe`

El frontend SHALL consumir `GET {VITE_API_URL}/api/v1/routes/safe` con los query params
`origin_lat`, `origin_lng`, `dest_lat`, `dest_lng` (WGS84, dentro de CABA) y opcionalmente
`datetime` en formato RFC3339 con offset. `VITE_API_URL` SHALL ser por defecto
`http://localhost:8080`.

El endpoint ahora es **protegido**: la request SHALL hacerse vía `authFetch` con
`Authorization: Bearer <accessToken>`. Ante `401` que sobreviva al auto-refresh de `authFetch`, el
frontend SHALL tratarlo como sesión expirada y mandar a login (no como error de input).

La respuesta SHALL tiparse como `SafeRoutesResponse`, donde `routes` es un arreglo de **1 a 4**
objetos `SafeRoute`. El frontend SHALL localizar cada ruta por su campo `kind`
(`fastest|balanced|safest|least_safe_candidate`) y NUNCA SHALL asumir un índice fijo ni que
`least_safe_candidate` está presente.

El resultado SHALL cachearse con TanStack Query (stale time 5 min) keyed por
`(origin, destination, datetime/hour)`, y SHALL dispararse solo cuando `authStore.status` es
`authenticated`.

#### Scenario: Request autenticada

- **GIVEN** un usuario autenticado y origen/destino válidos
- **WHEN** se dispara la búsqueda de rutas
- **THEN** la request lleva `Authorization: Bearer` y devuelve `200` con las rutas

#### Scenario: Sesión expirada durante la búsqueda

- **GIVEN** un access token vencido cuya cookie de refresh también expiró
- **WHEN** se dispara la búsqueda y el auto-refresh falla
- **THEN** la UI manda a login en lugar de mostrar un error de ruta

#### Scenario: Sin sesión

- **GIVEN** `authStore.status` distinto de `authenticated`
- **WHEN** se evalúa `useRoute`
- **THEN** la query no se dispara
