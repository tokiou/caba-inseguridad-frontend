# Tasks: Explicabilidad de rutas

## 1. Tipos

- [x] 1.1 `types/route.ts`: agregar `DominantFactor`, `RiskiestSegment`, `RouteSegment`,
      `BucketRisk`, `TimeOfDayRisk`; extender `SafeRoute` con `riskiest_segment?`, `segments?`,
      `dominant_factor`, `armed_share_percent`, `time_of_day_risk?`.

## 2. Composición de prosa

- [x] 2.1 `utils/routeKind.ts`: agregar `DOMINANT_FACTOR_LABELS` y `BUCKET_NOUN`.
- [x] 2.2 `utils/routeExplain.ts`: helpers puros `dondePhrase`, `quePhrase`, `cuandoPhrase`
      (devuelven `null` si falta la metadata).

## 3. Panel

- [x] 3.1 `RouteExplainer.tsx` (nuevo): dónde / qué / cuándo desde la ruta seleccionada, con acción
      "ver en el mapa" y mini-visual de `time_of_day_risk`.
- [x] 3.2 `FloatingPanel.tsx`: insertar `RouteExplainer` entre métricas y alternativas.
- [x] 3.3 `RiskExplanation.tsx`: queda como disclaimer + versión del modelo (sin cambios de fondo).

## 4. Mapa

- [x] 4.1 `store/routeStore.ts`: `focusPoint` + `setFocusPoint` para "ver en el mapa".
- [x] 4.2 `MarkersLayer.tsx`: marcador de alerta sobre `riskiest_segment.point` de la ruta
      seleccionada; `flyTo` cuando cambia `focusPoint`.

## 5. Mock

- [x] 5.1 `mocks/routeMock.ts`: agregar metadata explicativa a las rutas (coherente con la tabla §9).

## 6. Verificación

- [x] 6.1 `npm run lint` y `npm run build` sin errores.
- [x] 6.2 Campos opcionales ausentes no rompen panel ni mapa.
- [ ] 6.3 Archivar specs a `openspec/specs/{routing,map,sidebar}` al mergear (post-merge).
