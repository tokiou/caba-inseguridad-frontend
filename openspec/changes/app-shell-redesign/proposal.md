# Proposal: App-shell redesign (sidebar + topbar + barra de rutas)

**Change:** app-shell-redesign
**Status:** proposed
**Branch:** feat/sidebar-redesign-and-route-ui

---

## Intent

Reemplazar el panel flotante por un **app-shell** tipo dashboard de mapas (referencia: `image.png`):

- **Sidebar fijo** a la izquierda (full-height): marca, Origen/Destino, Prioridad de la ruta,
  Capas del mapa, CTA "Buscar rutas" y disclaimer/fuente.
- **Topbar** sobre el mapa: búsqueda global de lugar (centra el mapa), toggle **Día/Noche** del
  basemap y dropdown **Capas**.
- **Barra inferior** sobre el mapa con **3 tarjetas** (más rápida / balanceada / más segura): tiempo,
  distancia, comparación, mini-sparkline y nivel de exposición; seleccionar una la resalta en el
  mapa. Link "Ver detalle de las rutas" abre el detalle (métricas + explicación) de la seleccionada.
- El mapa ocupa el resto, con controles de zoom/geolocalización.

## Scope

**Incluye:**

- Layout shell (`App.tsx`): `Sidebar` + área de mapa con `TopBar`, `MapView` y `RouteCardsBar`.
- `Sidebar`, `TopBar`, `RoutePrioritySelector` (radios), `MapLayersList` (toggles), `RouteCardsBar`
  + `RouteCard` + `Sparkline`, `RouteDetailModal`.
- `uiStore`: `basemap` (Día/Noche), toggles de capas, `detailOpen`.
- Toggle de basemap Día/Noche (dark-matter ↔ positron) reinicializando el mapa.
- Reutilizar lógica existente: `selectedKind`, `routeByKind`, `focusPoint`, autocomplete Nominatim.

**No incluye:**

- Datos reales de las capas "Robos y hurtos / Transporte público / Cámaras" (no hay fuente): los
  toggles quedan como UI con estado; solo "Zonas de riesgo" tiene efecto (marcadores de riesgo).
- Cambios en el contrato del backend ni en la metadata de rutas.

## Approach

- App pasa a `flex`: `Sidebar` (ancho fijo) + contenedor relativo `flex-1` con el mapa y los overlays
  (topbar arriba, cards abajo).
- Se retiran del mapa la `SafetyLegend` y el `MapRouteSummary` (los reemplaza la barra de cards).
- `RouteCard` lee cada ruta por `kind`; al click hace `setSelectedKind`. La barra tolera 1..N rutas.
- Día/Noche: `MapView` lee `basemap` del `uiStore` y se **remonta** vía `key` al cambiar (recrea el
  mapa con el nuevo style; `RouteLayer`/`MarkersLayer` re-agregan sus fuentes en el nuevo `load`).
- "Ver detalle" abre `RouteDetailModal` que reutiliza `RiskSummaryCard`, `RouteMetricsGrid` y
  `RouteExplainer` de la ruta seleccionada.
