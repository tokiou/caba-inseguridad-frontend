# Tasks: App-shell redesign

## 1. Estado UI
- [x] 1.1 `store/uiStore.ts`: `basemap` + `toggleBasemap`; `layers` + `toggleLayer`; `detailOpen` + `setDetailOpen`.

## 2. Layout
- [x] 2.1 `App.tsx`: shell flex (Sidebar + área de mapa con TopBar/MapView/RouteCardsBar) + RouteDetailModal.
- [x] 2.2 `MapView.tsx`: leer `basemap`, quitar SafetyLegend + MapRouteSummary, agregar GeolocateControl; remonte por `key`.

## 3. Sidebar
- [x] 3.1 `components/layout/Sidebar.tsx`: marca, Origen/Destino, Prioridad, CTA, Capas, footer.
- [x] 3.2 `AddressAutocomplete.tsx`: prop `leadingIcon` + botón X para limpiar.
- [x] 3.3 `components/layout/RoutePrioritySelector.tsx`: radios (más rápida/balanceada/más segura) → selectedKind.
- [x] 3.4 `components/layout/MapLayersList.tsx`: toggles de capas (uiStore).

## 4. Topbar
- [x] 4.1 `components/layout/TopBar.tsx`: búsqueda (flyTo) + Día/Noche + dropdown Capas.

## 5. Barra de rutas
- [x] 5.1 `components/panel/RouteCardsBar.tsx`: lista de cards + "Ver detalle".
- [x] 5.2 `components/panel/RouteCard.tsx`: título/badge/tiempo/distancia/sub/sparkline/exposición; click selecciona.
- [x] 5.3 `components/panel/Sparkline.tsx`: mini-gráfico SVG desde segments/time_of_day.

## 6. Detalle
- [x] 6.1 `components/panel/RouteDetailModal.tsx`: reutiliza RiskSummaryCard + RouteMetricsGrid + RouteExplainer.

## 7. Verificación
- [x] 7.1 `npm run lint` y `npm run build` sin errores.
- [ ] 7.2 Día/Noche, selección por card, búsqueda topbar y toggle de zonas de riesgo funcionan.
- [ ] 7.3 Archivar specs al mergear (post-merge).
