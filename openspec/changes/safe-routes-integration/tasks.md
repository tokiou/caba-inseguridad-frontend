# Tasks: Integración del backend real de rutas seguras

## 1. Contrato y tipos

- [x] 1.1 Reemplazar `types/route.ts` por los tipos del contrato: `RouteKind`, `RiskLevel`,
      `TimeBucket`, `WeekdayType`, `LatLng`, `ModelVersionInfo`, `CrimeMetrics`,
      `GeoJSONLineString`, `SafeRoute`, `SafeRoutesResponse`, `ApiError`. Eliminar `RouteResponse`,
      `RouteSegment`, `RobberyStats`, `SafetyLevel`, `RouteProfile`, `safety_score`.

## 2. Servicio y datetime

- [x] 2.1 `utils/datetime.ts`: `buildBuenosAiresDatetime(hour)` → `YYYY-MM-DDTHH:00:00-03:00`.
- [x] 2.2 `services/routeService.ts`: `fetchSafeRoutes(origin, destination, datetime?)` contra
      `/api/v1/routes/safe`; `SafeRoutesError` con `code`, `message`, `requestId`.
- [x] 2.3 `services/api.ts`: default `VITE_API_URL` = `http://localhost:8080`; `.env.example`.

## 3. Estado

- [x] 3.1 `store/routeStore.ts`: `response`, `selectedKind`, `hiddenKinds`, `popupKind`, `hour`;
      `setResponse` con fallback de `selectedKind`; `toggleKind`, `setSelectedKind`, `setPopupKind`,
      `routeByKind`, `clearRoute`.
- [x] 3.2 `hooks/useRoute.ts`: query `safe-routes` keyed por `(origin, destination, hour)`.

## 4. Colores y utilidades

- [x] 4.1 `utils/safetyColors.ts` → riesgo/kind: `RISK_COLORS` (low/moderate/high),
      `KIND_COLORS`, helper `riskLevelColor`. Eliminar `scoreToLevel`/`scoreToColor`.

## 5. Mapa

- [x] 5.1 `RouteLayer.tsx`: render multi-ruta (fuente sólida + punteada), color `match` por `kind`,
      énfasis + glow para `selectedKind`, `line-sort-key`, fitBounds a la seleccionada.
- [x] 5.2 Click en ruta → `setSelectedKind` + popup de ruta; cierre por clic fuera / Escape.
- [x] 5.3 `popupHtml.ts` → `renderRoutePopupHtml(route, fastest)` con métricas agregadas +
      exposición relativa (sin conteos).
- [x] 5.4 `MarkersLayer.tsx`: usar `response.origin`/`destination` con fallback a extremos.
- [x] 5.5 `SafetyLegend.tsx`: leyenda de tipos de ruta + disclaimer.
- [x] 5.6 `MapRouteSummary.tsx`: resumen de la ruta seleccionada (risk_level, distancia, duración).

## 6. Panel

- [x] 6.1 `RouteProfileSelector.tsx`: setear `selectedKind`; deshabilitar opción ausente.
- [x] 6.2 `RiskSummaryCard.tsx`: exposición de la ruta seleccionada + comparación vs fastest +
      subtítulo `time_bucket`/`weekday_type`.
- [x] 6.3 `RouteMetricsGrid.tsx`: distancia, duración, extra vs fastest, peor tramo. Sin conteos.
- [x] 6.4 `RouteAlternativesList.tsx` (nuevo): lista por `kind` con selección + toggle visibilidad.
- [x] 6.5 `RiskExplanation.tsx` → disclaimer de exposición histórica + nota de `crime_metrics`.
- [x] 6.6 `FloatingPanel.tsx`: cablear `response`, errores por código, render condicional.
- [x] 6.7 `SearchCard.tsx`: demo con mock nuevo; CTA dispara fetch.
- [x] 6.8 `TimePicker.tsx`: textos de exposición (sin cambios de lógica de hora).

## 7. Mock

- [x] 7.1 `mocks/routeMock.ts`: `MOCK_SAFE_ROUTES: SafeRoutesResponse` con 4 rutas Palermo→San Telmo
      (valores tipo tabla del ejemplo §9 del contrato).

## 8. Infra

- [x] 8.1 `package.json`: `dev` en `--port 8081 --strictPort` (CORS del backend).

## 9. Verificación

- [x] 9.1 `npm run lint` y `npm run build` sin errores.
- [x] 9.2 Demo: las 4 rutas se ven, se seleccionan, se ocultan; popup por ruta sin conteos.
- [ ] 9.3 Actualizar specs `openspec/specs/{routing,map,sidebar}` al archivar el change (post-merge).
