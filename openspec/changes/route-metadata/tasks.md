# Tasks: Route Visualization & Segment Metadata

- [ ] Agregar `peak_hours?: Array<{ hour: number; count: number }>` a `RobberyStats` en `src/types/route.ts`
- [ ] Crear `src/mocks/routeMock.ts` con `MOCK_ROUTE` (ruta Palermo → San Telmo, 6+ segmentos, variados safety_score)
- [ ] Agregar botón "Ver demo" en `SearchCard` / `RouteSearchForm` que llama `setActiveRoute(MOCK_ROUTE)`
- [ ] Agregar `popupRef` en `RouteLayer.tsx` y crear popup imperativo al click en segmento
- [ ] Crear función `renderPopupHtml(props)` que genera el HTML del popup (safety dot, robbery count, armed %, peak hour, mini gráfico de barras)
- [ ] Agregar override de estilos `.route-popup` en `src/index.css` (glassmorphism, sin tip)
- [ ] Cerrar popup al hacer clic fuera de `LAYER_LINE` (`map.on('click', ...)` sin feature)
- [ ] Limpiar `selectedSegment` al cerrar el popup
- [ ] Smoke test visual: abrir demo, clicar segmentos, verificar popup con glassmorphism
