# Delta Spec: Route Mock Data

---

## ADDED Requirements

### Requirement: Mock route con segmentos de variados niveles

SHALL existir un archivo `src/mocks/routeMock.ts` que exporte una constante `MOCK_ROUTE` de tipo `RouteResponse`. La ruta SHALL recorrer un trayecto representativo dentro de CABA (ej. Palermo → San Telmo) con al menos **6 segmentos** con los siguientes `safety_score` representativos:
- 2 segmentos seguros (score ≥ 0.7)
- 2 segmentos moderados (score entre 0.4 y 0.69)
- 2 segmentos peligrosos (score < 0.4)

Cada segmento SHALL tener `robbery_count`, `armed_robbery_count`, `hour_range` y `peak_hours` (array de objetos `{hour: number, count: number}` con los 3 horarios de mayor actividad delictiva).

#### Scenario: Mock route carga sin backend
- **GIVEN** el backend no está disponible
- **WHEN** el usuario hace clic en "Ver demo"
- **THEN** `MOCK_ROUTE` se carga en `routeStore.activeRoute` y la ruta aparece en el mapa con sus colores sin ninguna llamada HTTP

---

### Requirement: Botón "Ver demo" en el panel de búsqueda

SHALL existir un botón secundario "Ver demo" debajo del botón principal de búsqueda. Al hacer clic SHALL llamar `setActiveRoute(MOCK_ROUTE)` y también hacer `fitBounds` al extent de la ruta mock.

#### Scenario: Demo activa la ruta sin formulario completado
- **GIVEN** los inputs de origen/destino están vacíos
- **WHEN** el usuario hace clic en "Ver demo"
- **THEN** la ruta mock aparece en el mapa con todos sus colores y el panel de stats se activa

---

### Requirement: Extensión del tipo RouteSegment con peak_hours

`src/types/route.ts` → `RobberyStats` SHALL incluir un campo opcional `peak_hours?: Array<{ hour: number; count: number }>` con los horarios de mayor actividad.
