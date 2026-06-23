# Proposal: Explicabilidad de rutas (metadata del porqué)

**Change:** route-explainability
**Status:** proposed
**Branch:** feat/sidebar-redesign-and-route-ui

---

## Intent

El backend ahora adjunta a cada ruta **metadata explicativa** (no texto: métricas) que permite
responder *por qué* una ruta tiene su nivel de riesgo: **dónde** (la cuadra peor),
**qué** (tipo de delito dominante, % con arma) y **cuándo** (riesgo por franja horaria). El frontend
debe **componer la prosa** a partir de esa metadata y mostrarla, además de poder señalar en el mapa
la cuadra problemática.

Esto se apoya sobre la integración ya implementada (`safe-routes-integration`) y solo **agrega**
campos y UI; no cambia el endpoint, los params ni el modelo de múltiples rutas por `kind`.

## Scope

**Incluye:**

- Nuevos tipos del contrato: `DominantFactor`, `RiskiestSegment`, `RouteSegment`, `BucketRisk`,
  `TimeOfDayRisk`; y extensión de `SafeRoute` con `riskiest_segment?`, `segments?`,
  `dominant_factor`, `armed_share_percent`, `time_of_day_risk?`.
- Bloque de **explicación del porqué** en el panel para la ruta seleccionada:
  - **Dónde**: cuadra de mayor riesgo (`riskiest_segment`) — nivel, robos, con arma, y acción
    "ver en el mapa".
  - **Qué**: `dominant_factor` + `armed_share_percent`.
  - **Cuándo**: mini visualización de `time_of_day_risk` por las 4 franjas, con `peak_bucket`
    resaltada.
- **Marcador en el mapa** sobre `riskiest_segment.point` de la ruta seleccionada.
- Manejo robusto de campos **opcionales ausentes** (rutas sin tramos) y `dominant_factor: "none"`.
- Mock actualizado con la metadata para tests/dev.

**No incluye:**

- **Heatmap por cuadra** recoloreando la polilínea con `segments[]`: se mantiene el color por
  `kind` (decisión visual vigente). `segments[]` se tipa y queda disponible, pero el recoloreo full
  queda como mejora futura.
- Texto/prosa provista por el backend (sigue siendo el FE quien la arma).
- Cambios en endpoint, request, errores o estado base de routing.

## Approach

- **Tipos** (`types/route.ts`): se agregan las interfaces nuevas y se extiende `SafeRoute`. Los
  campos omitibles van como opcionales (`?`) para tolerar rutas sin tramos.
- **Composición de prosa** (`utils/routeExplain.ts`): helpers puros que reciben un `SafeRoute` y
  devuelven los textos ("Sube a alto por una cuadra con N robos…", etiquetas de `dominant_factor`,
  sustantivo de `peak_bucket`). Sin JSX, testeable.
- **Panel** (`RouteExplainer.tsx`, nuevo): consume la ruta seleccionada y renderiza dónde/qué/cuándo
  en el lenguaje de exposición histórica. Se ubica entre las métricas y la lista de alternativas.
  `RiskExplanation` se mantiene como disclaimer + versión del modelo.
- **Mapa** (`MarkersLayer.tsx`): además de origen/destino, coloca un marcador de alerta sobre
  `riskiest_segment.point` de la ruta seleccionada (si existe). El botón "ver en el mapa" del panel
  centra el mapa en ese punto.
- **Lenguaje**: siempre exposición histórica relativa; los conteos nunca como "N delitos en la
  ruta".
