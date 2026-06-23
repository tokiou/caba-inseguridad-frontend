# Delta Spec: Routing — contrato real `/api/v1/routes/safe`

Domain: **routing**

---

## ADDED Requirements

### Requirement: Safe routes fetch contra `/api/v1/routes/safe`

El frontend SHALL consumir `GET {VITE_API_URL}/api/v1/routes/safe` con los query params
`origin_lat`, `origin_lng`, `dest_lat`, `dest_lng` (WGS84, dentro de CABA) y opcionalmente
`datetime` en formato RFC3339 con offset. `VITE_API_URL` SHALL ser por defecto
`http://localhost:8080`.

La respuesta SHALL tiparse como `SafeRoutesResponse`, donde `routes` es un arreglo de **1 a 4**
objetos `SafeRoute`. El frontend SHALL localizar cada ruta por su campo `kind`
(`fastest|balanced|safest|least_safe_candidate`) y NUNCA SHALL asumir un índice fijo ni que
`least_safe_candidate` está presente.

El resultado SHALL cachearse con TanStack Query (stale time 5 min) keyed por
`(origin, destination, datetime/hour)`.

#### Scenario: Respuesta con 4 rutas

- **GIVEN** origen y destino válidos dentro de CABA
- **WHEN** el fetch responde 200 con `routes` de longitud 4
- **THEN** la respuesta se guarda en `routeStore.response` y el frontend resuelve cada ruta por
  `kind`

#### Scenario: `least_safe_candidate` ausente

- **GIVEN** una respuesta 200 con solo `fastest`, `balanced` y `safest`
- **WHEN** el frontend procesa `routes[]`
- **THEN** la UI funciona sin romper el layout y no referencia una ruta `least_safe_candidate`
  inexistente

### Requirement: Construcción de `datetime` RFC3339 en zona AR

El selector de horario (0–23) SHALL producir un `datetime` RFC3339 con offset `-03:00` usando la
fecha actual en `America/Argentina/Buenos_Aires`, con formato `YYYY-MM-DDTHH:00:00-03:00`. El
frontend NO SHALL enviar la hora en UTC 'Z' para no desfasar la franja horaria que resuelve el
backend.

#### Scenario: Usuario elige las 23:00

- **GIVEN** el picker en hora 23 y la fecha actual AR es 2026-06-12
- **WHEN** se dispara la búsqueda
- **THEN** el query param `datetime` es `2026-06-12T23:00:00-03:00`

### Requirement: Manejo del envelope de error del backend

Ante una respuesta no-2xx, el servicio SHALL parsear el envelope `{ error, message }` y lanzar un
error que conserve el `code` (`error`), el `message` y el header `X-Request-Id`. La UI SHALL mapear
los códigos a mensajes accionables:

- `invalid_request` / `origin_or_destination_outside_walkable_graph` → pedir puntos sobre calles de
  CABA y permitir reintentar.
- `route_not_found` → "No encontramos una ruta caminable entre esos puntos."
- `risk_model_unavailable` → estado de servicio caído, reintentar luego.
- `internal_error` / desconocido → mensaje genérico con reintento; loguear `X-Request-Id`.

#### Scenario: Punto fuera del grafo caminable

- **GIVEN** un destino a más de 150 m de la red caminable
- **WHEN** el backend responde 400 `origin_or_destination_outside_walkable_graph`
- **THEN** la UI muestra el mensaje de "elegí un punto sobre una calle de CABA" y permite reintentar

#### Scenario: Modelo de riesgo no disponible

- **GIVEN** el backend sin modelo activo
- **WHEN** responde 503 `risk_model_unavailable`
- **THEN** la UI muestra un estado de servicio no disponible, no culpa al input del usuario

### Requirement: Estado de rutas en `routeStore`

`routeStore` (Zustand) SHALL contener: `origin`, `destination` (con `label`), `hour`,
`selectedKind` (`RouteKind`, default `balanced`), `hiddenKinds` (`RouteKind[]`), `popupKind`
(`RouteKind | null`) y `response` (`SafeRoutesResponse | null`). Al setear `response`, si
`selectedKind` no existe en `routes[]`, SHALL caer al primer `kind` presente. SHALL exponer un
helper `routeByKind(kind)`.

#### Scenario: selectedKind ausente en la respuesta

- **GIVEN** `selectedKind` = `balanced`
- **WHEN** llega una `response` cuyas `routes[]` no incluyen `balanced`
- **THEN** `selectedKind` pasa al primer `kind` disponible de la respuesta

---

## REMOVED Requirements

### Requirement: Route fetch

**Reason:** El endpoint `GET /api/route?from&to&hour` y el modelo `RouteResponse`
(FeatureCollection con `summary`) no corresponden al backend real. Reemplazado por
"Safe routes fetch contra `/api/v1/routes/safe`".

**Migration:** Los consumidores pasan de `activeRoute` (FeatureCollection) a
`response.routes` (arreglo de `SafeRoute`); la geometría por ruta es una sola `LineString`.

### Requirement: Travel time picker

**Reason:** El param `hour` entero se reemplaza por `datetime` RFC3339. El picker se conserva en la
UI pero su salida alimenta la construcción de `datetime`.

**Migration:** Ver "Construcción de `datetime` RFC3339 en zona AR".
