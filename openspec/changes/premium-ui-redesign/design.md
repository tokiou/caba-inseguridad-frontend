# Design — Premium UI Redesign

## Paleta

Tokens nuevos (en `index.css @theme` y `safetyColors.ts`):

| Rol | Hex |
|-----|-----|
| safe | `#00E599` |
| moderate | `#F5B82E` |
| danger | `#FF4D4D` |
| no_data / unknown | `#7B8191` |
| info / cyan | `#00D7FF` |

Surfaces: panel `#0F1117`, elevated `#151821`, input `#181B24`,
border `rgba(255,255,255,0.08)`, text primary `#F5F7FA`, secondary `#8B93A7`,
muted `#626B7F`.

## Estado frontend

```ts
type RouteProfile = 'fastest' | 'balanced' | 'safest'   // labels: Rápida / Balanceada / Segura
```

`routeStore` agrega:
- `routeProfile: RouteProfile` (default `'balanced'`) + `setRouteProfile`
- `alternativeRoute: FeatureCollection | null` + `setAlternativeRoute`

`RouteSummary` (type) se extiende con campos **opcionales** (no rompen el
contrato backend): `safety_score`, `exposure_reduction_pct`, `critical_zones`,
`peak_activity_range`, `origin_label`, `destination_label`.

## Componentes

```
components/panel/
  PanelHeader.tsx          # logo container premium + colapsar
  SearchCard.tsx           # sección de búsqueda (compone los de abajo)
  RouteSearchForm.tsx      # inputs origen/destino tipo route-planner
  RouteProfileSelector.tsx # segmented control Rápida/Balanceada/Segura
  RiskSummaryCard.tsx      # resultado: label + score + barra + comparación
  RouteMetricsGrid.tsx     # grilla 2×2 de métricas
  RiskExplanation.tsx      # zonas críticas / horario pico
components/route/
  TimePicker.tsx           # slider con hora jerárquica + sublabel contextual
components/map/
  MarkersLayer.tsx         # pins origen (verde) / destino (coral) + label
  RouteLayer.tsx           # ruta principal (glow) + alternativa punteada
  SafetyLegend.tsx         # pill rediseñada
  MapRouteSummary.tsx      # mini-resumen flotante opcional
```

## Decisiones

- **Ruta alternativa** = `FeatureCollection` mock con una `LineString`, render
  como capa `line` punteada (`line-dasharray [2,2]`, gris azulado, fina) por
  debajo de la ruta principal. Prop/estado listo para datos reales.
- **Pins**: si hay `activeRoute` sin `origin/destination` en store (caso demo),
  los endpoints se derivan de la geometría y las etiquetas de
  `summary.origin_label` / `destination_label`.
- **Score**: si `summary.safety_score` está presente se usa; si no, se promedia
  `safety_score` de los segmentos (mock demo ⇒ 52%).
- **Copy**: "Ruta con riesgo moderado", "52% seguridad estimada",
  "32% menos exposición que la ruta más rápida". Lenguaje de exposición
  histórica, sin alarmismo.
