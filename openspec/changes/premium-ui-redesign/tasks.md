# Tasks — Premium UI Redesign

## Fundaciones
- [x] Actualizar paleta en `index.css` (@theme + glass-panel + estilos helper)
- [x] Actualizar `safetyColors.ts` a la paleta premium
- [x] Extender `types/route.ts` (`RouteProfile`, campos opcionales en `RouteSummary`)
- [x] Extender `store/routeStore.ts` (`routeProfile`, `alternativeRoute`)
- [x] Extender `mocks/routeMock.ts` (summary premium + `MOCK_ALT_ROUTE`)

## Panel
- [x] `PanelHeader.tsx` premium
- [x] `RouteSearchForm.tsx` (inputs route-planner)
- [x] `TimePicker.tsx` con hora jerárquica + sublabel
- [x] `RouteProfileSelector.tsx` segmented control
- [x] CTA principal + demo en `SearchCard.tsx`
- [x] `RiskSummaryCard.tsx`
- [x] `RouteMetricsGrid.tsx`
- [x] `RiskExplanation.tsx`
- [x] Recomponer `FloatingPanel.tsx`

## Mapa
- [x] `MarkersLayer.tsx` pins premium + label
- [x] `RouteLayer.tsx` glow + ruta alternativa punteada + colores nuevos
- [x] `SafetyLegend.tsx` pill rediseñada
- [x] `MapRouteSummary.tsx` mini-resumen flotante

## Verificación
- [x] `npm run build` sin errores de tipos
- [x] Demo Palermo → San Telmo muestra ruta + alternativa + pins + resultado
