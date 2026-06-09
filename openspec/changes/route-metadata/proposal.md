# Proposal: Route Visualization & Segment Metadata

**Change:** route-metadata  
**Status:** proposed  
**Branch:** feat/sidebar-redesign-and-route-ui

---

## Intent

Sin backend disponible no podemos ver cómo lucen las rutas coloreadas. Necesitamos:
1. **Mock data** que simule una ruta real con segmentos de distintos niveles de seguridad, para poder desarrollar y validar el diseño sin depender del backend.
2. **Popup de metadatos** al hacer clic en un segmento de la ruta, mostrando: robos detectados en ese segmento, franja horaria de mayor actividad, y porcentaje de robos con armas — todo con iconografía clara.

## Scope

**Incluye:**
- Hook `useMockRoute` que genera una ruta de demostración sobre CABA con segmentos de distintos `safety_score`
- Botón "Ver demo" en el panel de búsqueda para activar el mock sin necesidad de backend
- Popup de MapLibre sobre el mapa al hacer clic en un segmento de ruta
- Contenido del popup: safety score visual, robbery count, armed %, peak hours como mini gráfico de barras
- El popup cierra al hacer clic fuera o al presionar Escape

**No incluye:**
- Múltiples rutas alternativas (solo la ruta óptima)
- Animación de recorrido de la ruta
- Integración con datos reales de horario (eso viene del backend)

## Approach

El mock data se define como una constante GeoJSON en `src/mocks/routeMock.ts`. El hook `useMockRoute` retorna este dato en el mismo shape que `RouteResponse`. El botón "Ver demo" llama a `setActiveRoute(mockData)` directamente en el store, sin pasar por el fetch.

El popup se implementa con `maplibregl.Popup` creado imperativa mente dentro de `RouteLayer.tsx` al recibir el evento `click` en `LAYER_LINE`. El contenido se renderiza como HTML string (para compatibilidad con MapLibre) o como portal React montado en un `div` al que apunta el Popup.
