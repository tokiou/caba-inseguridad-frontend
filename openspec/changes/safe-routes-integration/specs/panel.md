# Delta Spec: Panel — alternativas, métricas comparativas y lenguaje de exposición

Domain: **sidebar**

---

## ADDED Requirements

### Requirement: Lista de rutas alternativas

El panel SHALL listar las rutas de `response.routes` (iterando por `kind`), cada una con: label de
`kind`, `risk_level` (dot + color), distancia, duración y comparación vs `fastest` cuando aplique
(`extra_distance_vs_fastest_meters`, `risk_reduction_vs_fastest_percent`). Cada item SHALL permitir
**seleccionarla** (la enfatiza en el mapa y la detalla) y **alternar su visibilidad** en el mapa.
La ruta `least_safe_candidate` SHALL marcarse visualmente como contraste, no como recomendación, y
SHALL omitirse limpiamente si no viene.

#### Scenario: Seleccionar una alternativa

- **GIVEN** la lista con `fastest`, `balanced`, `safest`
- **WHEN** el usuario toca `safest`
- **THEN** `selectedKind` pasa a `safest`, el mapa la enfatiza y las métricas del panel reflejan esa
  ruta

#### Scenario: Argumento comparativo

- **GIVEN** una ruta `balanced` con `extra_distance_vs_fastest_meters` = 903 y
  `risk_reduction_vs_fastest_percent` = 49.9
- **WHEN** se muestra su item
- **THEN** el texto comunica "+903 m · −50% exposición" como su argumento principal

### Requirement: Selector de perfil mapeado a `kind`

El selector de perfil (Rápida / Balanceada / Segura) SHALL fijar `selectedKind` a
`fastest` / `balanced` / `safest` respectivamente. Si la ruta elegida no está presente en la
respuesta, la opción SHALL deshabilitarse o caer a una disponible.

#### Scenario: Perfil "Segura"

- **GIVEN** una respuesta con `safest` presente
- **WHEN** el usuario elige "Segura"
- **THEN** `selectedKind` pasa a `safest`

### Requirement: Subtítulo de contexto temporal

El panel SHALL mostrar el contexto resuelto por el backend a partir de `time_bucket` y
`weekday_type` (ej. "Ruta nocturna · día de semana").

#### Scenario: Contexto nocturno

- **GIVEN** una respuesta con `time_bucket` = `night` y `weekday_type` = `weekday`
- **WHEN** el panel renderiza el resultado
- **THEN** se muestra un subtítulo como "Ruta nocturna · día de semana"

### Requirement: Lenguaje de exposición histórica obligatorio

Todos los textos del panel y popup SHALL hablar de **"exposición histórica estimada al delito"** y
SHALL incluir un disclaimer permanente. NUNCA SHALL afirmar que una ruta "es segura" ni prometer
seguridad. Los valores de `crime_metrics` NO SHALL presentarse como conteos de delitos.

#### Scenario: Disclaimer presente

- **GIVEN** una ruta seleccionada
- **WHEN** el panel muestra su resultado
- **THEN** hay un disclaimer visible de exposición histórica estimada sin garantías de seguridad

---

## MODIFIED Requirements

### Requirement: Route statistics panel

El panel de estadísticas SHALL describir la ruta seleccionada usando métricas **agregadas** del
contrato real: nivel y score de riesgo (como exposición), distancia, duración y comparación vs
`fastest`. SHALL mostrar el peor tramo (`high_risk_edge_percent`, `max_edge_risk`) cuando esté
disponible. NO SHALL mostrar "robos registrados" ni "con arma" como conteos absolutos.

#### Scenario: Resultado de la ruta seleccionada

- **GIVEN** `selectedKind` = `balanced`
- **WHEN** el panel renderiza
- **THEN** muestra el `risk_level` como exposición, distancia, duración y la reducción de exposición
  vs la ruta más rápida, sin conteos de delitos

### Requirement: Error state

El panel SHALL mostrar mensajes accionables según el código de error del backend
(`invalid_request`, `origin_or_destination_outside_walkable_graph`, `route_not_found`,
`risk_model_unavailable`, `internal_error`) en lugar de un único mensaje genérico.

#### Scenario: Ruta no encontrada

- **GIVEN** una búsqueda que el backend responde 404 `route_not_found`
- **WHEN** el panel maneja el error
- **THEN** muestra "No encontramos una ruta caminable entre esos puntos."
