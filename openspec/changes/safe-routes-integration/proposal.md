# Proposal: Integración del backend real de rutas seguras

**Change:** safe-routes-integration
**Status:** proposed
**Branch:** feat/sidebar-redesign-and-route-ui

---

## Intent

El backend real (`GET /api/v1/routes/safe`) ya está definido y su contrato difiere
**sustancialmente** del modelo que el frontend asumía hasta ahora. Necesitamos alinear el
frontend al contrato real para poder consumir el endpoint en cuanto esté disponible, sin
reescribir nada más adelante.

Diferencias clave respecto al modelo actual:

1. **Múltiples rutas alternativas, no una ruta segmentada.** El backend devuelve hasta **4 rutas
   completas** (`fastest`, `balanced`, `safest`, `least_safe_candidate`), cada una una sola
   `LineString`. No hay metadatos por-segmento; las métricas son **agregadas por ruta**.
2. **Semántica de riesgo invertida.** El backend usa `risk_score` (0..1, **mayor = más peligroso**)
   y `risk_level` (`low|moderate|high`). El frontend usaba `safety_score` (mayor = más seguro).
3. **`crime_metrics` son sumas de exposición por tramo, NO conteos de incidentes.** Está
   **prohibido** mostrarlos como "X robos en esta ruta". Se presentan como intensidad/exposición
   relativa o se usan solo para comparar.
4. **Endpoint y params nuevos.** `GET /api/v1/routes/safe?origin_lat&origin_lng&dest_lat&dest_lng&datetime`
   (RFC3339), reemplaza `GET /api/route?from&to&hour`.
5. **Lenguaje de producto obligatorio.** Siempre "exposición histórica estimada al delito", nunca
   "ruta segura / seguridad garantizada".
6. **CORS.** El backend hoy permite **solo** `http://localhost:8081`. El dev server debe correr en
   ese puerto.

## Scope

**Incluye:**

- Tipos TypeScript alineados al contrato (`SafeRoutesResponse`, `SafeRoute`, `RouteKind`,
  `RiskLevel`, `CrimeMetrics`, `ModelVersionInfo`, `ApiError`).
- Servicio `fetchSafeRoutes` contra `/api/v1/routes/safe` con manejo del envelope de error
  (`{ error, message }`) y de los códigos documentados.
- `routeStore` reorganizado: `response`, `selectedKind`, visibilidad por `kind`, `datetime`.
- Construcción de `datetime` RFC3339 con offset `-03:00` (America/Argentina/Buenos_Aires) desde el
  selector de horario.
- Render de **hasta 4 rutas** en el mapa, coloreadas por `kind`, con la seleccionada enfatizada y
  `least_safe_candidate` punteada/baja opacidad. Iterar `routes[]` por `kind`, nunca por índice.
- Popup **a nivel de ruta** (no de segmento): nivel de riesgo, distancia/duración, comparación vs
  `fastest`, tramo de mayor riesgo. `crime_metrics` solo como exposición relativa.
- Panel: lista de alternativas con métricas comparativas, toggles de visibilidad por `kind`,
  selector de perfil mapeado a `kind`, subtítulo de contexto (`time_bucket` / `weekday_type`) y
  disclaimer permanente de exposición histórica.
- Mock reformado al nuevo contrato (`SafeRoutesResponse` con 4 rutas) para desarrollar sin backend.
- Dev server en `:8081` y `VITE_API_URL` por defecto `http://localhost:8080`.

**No incluye:**

- Autenticación (el backend aún no la tiene).
- Selector de fecha completo (se usa "hoy" + hora elegida; la fecha calendario queda fuera).
- Heatmap, animación de recorrido, ni persistencia de rutas favoritas.
- Cambios en el backend (el pedido de agregar el origen a `AllowedOrigins`, si hiciera falta otro
  puerto, es un OpenSpec change propio del backend).

## Approach

- **Tipos** (`types/route.ts`): se reemplaza el modelo `RouteResponse`/`RouteSegment`/`RobberyStats`
  por los tipos del contrato. `RouteProfile` se elimina en favor de `RouteKind`.
- **Servicio** (`services/routeService.ts`): `fetchSafeRoutes(origin, destination, datetime)` arma
  los query params, hace `fetch`, y ante `!res.ok` parsea el envelope y lanza un `SafeRoutesError`
  con `code` + `message` + `requestId` (header `X-Request-Id`).
- **Estado** (`store/routeStore.ts`): guarda `response`, `selectedKind` (default `balanced` con
  fallback al primer `kind` presente), `hiddenKinds` y `popupKind`. Helper `routeByKind`.
- **Mapa** (`RouteLayer.tsx`): una fuente para rutas sólidas + una para la punteada. Color por
  `kind` vía expresión `match`; ancho y glow según `selected`; `line-sort-key` para que la
  seleccionada y la `safest` queden arriba. Click en una ruta → selecciona ese `kind` y abre popup.
- **Popup** (`popupHtml.ts`): `renderRoutePopupHtml(route, fastest)` con métricas agregadas y
  exposición relativa, mismo glassmorphism.
- **Panel**: `RiskSummaryCard`, `RouteMetricsGrid`, `RiskExplanation` reescritos para consumir la
  ruta seleccionada; nuevo `RouteAlternativesList`. Lenguaje de exposición histórica en todos.
- **`datetime`**: util que formatea `YYYY-MM-DDTHH:00:00-03:00` con la fecha actual en zona AR.
