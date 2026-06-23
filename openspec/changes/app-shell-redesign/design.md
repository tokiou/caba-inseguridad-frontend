# Design: App-shell redesign

**Change:** app-shell-redesign

---

## 1. Estructura

```
<div class="flex h-full">
  <Sidebar />                         // ancho fijo ~284px, full-height, scroll propio
  <div class="relative flex-1">       // área de mapa
    <MapView key={basemap} />         // fills; overlays de ruta/markers; controles zoom+geo
    <TopBar />                        // absolute top: búsqueda + Día/Noche + Capas
    <RouteCardsBar />                 // absolute bottom: 3 cards + "Ver detalle"
  </div>
  <RouteDetailModal />                // overlay condicional (detailOpen)
</div>
```

## 2. Sidebar (de arriba a abajo)

1. **Marca**: "Rutas Seguras" + "CABA"; ícono hamburguesa (decorativo / colapso futuro).
2. **Origen / Destino**: `AddressAutocomplete` con ícono líder (punto verde / pin) y botón X para
   limpiar el texto. Setean `origin`/`destination` en `routeStore`.
3. **Prioridad de la ruta**: 3 radios (Más rápida / Balanceada / Más segura) → `selectedKind`
   (`fastest` / `balanced` / `safest`). El seleccionado muestra radio lleno.
4. **CTA "Buscar rutas"**: dispara el fetch (igual que el botón actual).
5. **Capas del mapa**: lista de toggles (`MapLayersList`).
6. **Footer**: disclaimer de exposición histórica + "Fuente: GCBA · Actualizado: …".

## 3. Topbar

- **Búsqueda global**: input con autocomplete; al elegir, `flyTo` al lugar (vía `focusPoint`). No
  fija origen/destino (eso es del sidebar).
- **Día/Noche**: botón que alterna `uiStore.basemap`.
- **Capas**: dropdown que reutiliza `MapLayersList`.

## 4. Barra de tarjetas (abajo)

`RouteCardsBar` lista las rutas en orden Más rápida → Balanceada → Más segura (las presentes).
Cada `RouteCard`:

| Elemento | Fuente |
|----------|--------|
| Título | etiqueta por `kind` (Más rápida / Balanceada / Más segura). |
| Badge | `risk_level` → "Riesgo alto/medio/bajo" + color. |
| Tiempo | `duration_minutes` → "18 min". |
| Distancia | `distance_meters` → "6.2 km". |
| Subtítulo | comparación vs fastest (`−X% exposición`) o "Ruta más directa" en fastest. |
| Sparkline | `segments[].risk_score` (o `time_of_day_risk`) coloreado por `risk_level`. |
| Exposición | `risk_level` → "Alta/Media/Baja". |

Click en una card → `setSelectedKind(kind)` (la resalta en el mapa). La seleccionada lleva borde de
acento. "Ver detalle de las rutas" → `setDetailOpen(true)`.

## 5. Día/Noche del basemap

`uiStore.basemap: 'dark' | 'light'` → style `dark-matter` (Noche) o `positron` (Día). `MapView` usa
el style según el store y se **remonta** con `key={basemap}` desde `App`, recreando el mapa. Como las
capas de ruta se agregan en el evento `load` y los datos viven en `routeStore`, el remonte repinta
todo sin refactor de `RouteLayer`. Default: `dark` (Noche), coherente con el resto de la UI.

## 6. Capas del mapa

`uiStore.layers: Record<LayerKey, boolean>` con `risk_zones`, `robberies`, `transit`, `cameras`.
Solo **`risk_zones`** tiene efecto real (visibilidad de los marcadores de cuadra de mayor riesgo en
`MarkersLayer`); las otras son toggles con estado a la espera de fuente de datos (documentado, no se
finge funcionalidad). Default: `risk_zones` on, resto off.

## 7. Trade-offs

- **Remontar el mapa** en Día/Noche es más costoso que `setStyle`, pero evita re-agregar fuentes a
  mano y es robusto. Aceptable para una acción esporádica.
- **Toggles sin datos**: se mantienen visibles por fidelidad al diseño; se comunican como
  placeholders. Cuando haya capas reales, se cablean sin cambiar el layout.
- Se retira la leyenda/summary del mapa; la barra de cards cumple esa función.
