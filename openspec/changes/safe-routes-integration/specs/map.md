# Delta Spec: Map — render multi-ruta y popup por ruta

Domain: **map**

---

## ADDED Requirements

### Requirement: Render de hasta 4 rutas coloreadas por `kind`

El mapa SHALL dibujar cada ruta de `response.routes` como una `LineString` independiente, coloreada
por `kind`:

| `kind`                 | Estilo |
|------------------------|--------|
| `safest`               | Verde `#00E599`, sólida. |
| `balanced`             | Ámbar `#F5B82E`, sólida. |
| `fastest`              | Rojo `#FF4D4D`, sólida. |
| `least_safe_candidate` | Gris `#7B8191`, **punteada**, opacidad baja. |

La ruta seleccionada (`selectedKind`) SHALL renderizarse enfatizada (mayor ancho + glow) y por
encima de las demás. El orden de apilado SHALL priorizar seleccionada > `safest` > `balanced` >
`fastest` > `least_safe_candidate`. El frontend SHALL iterar `routes[]` por `kind` y tolerar entre
1 y 4 rutas. La geometría se consume tal cual (`[lng, lat]`), sin invertir coordenadas.

#### Scenario: Cuatro rutas visibles

- **GIVEN** una respuesta con las 4 rutas
- **WHEN** el mapa renderiza
- **THEN** se ven 4 líneas con los colores por `kind` y `least_safe_candidate` punteada con baja
  opacidad

#### Scenario: Selección enfatizada

- **GIVEN** `selectedKind` = `safest`
- **WHEN** el mapa renderiza
- **THEN** la línea `safest` aparece más ancha, con glow y por encima de las otras

#### Scenario: Toggle de visibilidad por `kind`

- **GIVEN** las 4 rutas visibles
- **WHEN** el usuario oculta `fastest` desde el panel
- **THEN** la línea `fastest` desaparece del mapa y las demás permanecen

### Requirement: Encuadre a la ruta seleccionada

Al cambiar `response` o `selectedKind`, el mapa SHALL ajustar el viewport (`fitBounds`) a la
geometría de la ruta seleccionada, con padding que respete el panel flotante a la izquierda.

#### Scenario: Cambio de selección reencuadra

- **GIVEN** una respuesta cargada con `fastest` seleccionada
- **WHEN** el usuario selecciona `safest` (que toma un desvío)
- **THEN** el mapa reencuadra para mostrar la geometría completa de `safest`

### Requirement: Popup a nivel de ruta

Al hacer clic en una ruta, SHALL abrirse un popup de MapLibre (mismo glassmorphism que el panel)
con métricas **agregadas de la ruta**, NO de un segmento. El popup SHALL contener:

1. Indicador de `risk_level` (dot de color + label) y el `kind` de la ruta.
2. Distancia y duración (`distance_meters`, `duration_minutes`).
3. Comparación vs `fastest` cuando la ruta no es `fastest`:
   `extra_distance_vs_fastest_meters`, `extra_duration_vs_fastest_minutes`,
   `risk_reduction_vs_fastest_percent`.
4. Tramo de mayor riesgo: `high_risk_edge_percent` y `max_edge_risk`.
5. `crime_metrics` SOLO como exposición relativa/intensidad, **nunca** como conteo de delitos, con
   etiqueta de "exposición estimada".

Al abrir un popup, el `kind` de esa ruta SHALL quedar seleccionado. El popup SHALL cerrarse al
hacer clic fuera de las rutas, con Escape, o al abrir otro popup.

#### Scenario: Clic en la ruta balanced

- **GIVEN** una respuesta con `fastest` y `balanced`
- **WHEN** el usuario hace clic en la línea `balanced`
- **THEN** aparece un popup con su `risk_level`, distancia/duración y "+903 m · −50% exposición vs
  la más rápida", y `balanced` queda seleccionada

#### Scenario: Popup no muestra conteos de delitos

- **GIVEN** una ruta con `crime_metrics`
- **WHEN** se abre su popup
- **THEN** no se muestra ningún número como "X robos en esta ruta"; `crime_metrics` aparece solo
  como exposición relativa

---

## MODIFIED Requirements

### Requirement: Route layer with safety coloring

La capa de ruta SHALL colorear por `kind` de ruta (no por interpolación de `safety_score`
por-segmento, que ya no existe en el contrato). El color de `risk_level` se reserva para badges del
panel y del popup.

#### Scenario: Coloreado por tipo de ruta

- **GIVEN** una respuesta con varias rutas
- **WHEN** el mapa las dibuja
- **THEN** cada línea usa el color de su `kind` y no un gradiente por segmento

### Requirement: Safety legend overlay

La leyenda SHALL explicar los **tipos de ruta** (`safest`, `balanced`, `fastest`,
`least_safe_candidate`) con su color/estilo, y SHALL incluir el disclaimer de exposición histórica
estimada.

#### Scenario: Leyenda de tipos de ruta

- **GIVEN** el mapa renderizado
- **WHEN** el usuario mira la leyenda
- **THEN** ve los 4 tipos de ruta con su color y la línea punteada para `least_safe_candidate`

### Requirement: Origin and destination markers

Los marcadores de origen y destino SHALL ubicarse usando `response.origin` y `response.destination`
(re-emitidos por el backend) cuando estén disponibles, con fallback a los extremos de la ruta
seleccionada. Las etiquetas usan los labels del store cuando existan.

#### Scenario: Marcadores desde la respuesta

- **GIVEN** una respuesta cargada
- **WHEN** el mapa renderiza
- **THEN** los pines se ubican en `response.origin` / `response.destination`
