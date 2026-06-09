# Design: Route Visualization & Segment Metadata

---

## Decisiones técnicas

### Mock data

`src/mocks/routeMock.ts` exporta `MOCK_ROUTE: RouteResponse`. Las coordenadas son reales de CABA (Palermo → San Telmo siguiendo Av. Santa Fe / Av. 9 de Julio aprox.). Cada segmento se define con ~8-12 coordenadas para que tenga longitud visible en el mapa.

### Botón "Ver demo"

En `RouteSearchForm` (o en el nuevo `SearchCard`), un botón secundario de texto que llama directamente al store:
```ts
const { setActiveRoute } = useRouteStore()
// ...
<button onClick={() => setActiveRoute(MOCK_ROUTE)}>Ver demo</button>
```

### Implementación del popup

Se usa `maplibregl.Popup` de forma imperativa dentro de `RouteLayer`. Se mantiene una `ref` al popup actual para poder cerrarlo antes de abrir uno nuevo.

```ts
const popupRef = useRef<maplibregl.Popup | null>(null)

map.on('click', LAYER_LINE, (e) => {
  popupRef.current?.remove()
  const feature = e.features?.[0]
  const html = renderPopupHtml(feature.properties)
  popupRef.current = new maplibregl.Popup({ closeButton: false, className: 'route-popup' })
    .setLngLat(e.lngLat)
    .setHTML(html)
    .addTo(map)
  setSelectedSegment(feature)
})
```

El HTML del popup se genera como string (función `renderPopupHtml`). El mini gráfico de barras se hace con `div` con `width` calculado como porcentaje del máximo.

### Estilos del popup

Se sobreescribe `.maplibregl-popup-content` en `index.css`:
```css
.route-popup .maplibregl-popup-content {
  background: rgba(13, 15, 23, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  color: white;
}
.route-popup .maplibregl-popup-tip { display: none; }
```

### Componentes afectados

| Archivo | Acción |
|---|---|
| `src/types/route.ts` | Agregar `peak_hours` a `RobberyStats` |
| `src/mocks/routeMock.ts` | Crear (nuevo) |
| `src/components/map/RouteLayer.tsx` | Agregar popup imperativo con `popupRef` |
| `src/components/route/RouteSearchForm.tsx` | Agregar botón "Ver demo" |
| `src/index.css` | Agregar estilos override del popup de MapLibre |
