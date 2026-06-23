# Delta Spec — Premium UI

## ADDED: Selector de perfil de ruta

El sistema SHALL ofrecer un selector segmentado con tres perfiles:
Rápida (`fastest`), Balanceada (`balanced`), Segura (`safest`).

#### Scenario: cambiar perfil
- **GIVEN** el panel de búsqueda visible
- **WHEN** el usuario clickea un perfil
- **THEN** ese perfil queda marcado visualmente (verde `#00E599`) y se guarda en `routeStore.routeProfile`

#### Scenario: default
- **GIVEN** la app recién cargada
- **THEN** el perfil activo SHALL ser `balanced`

## ADDED: Resultado de riesgo

El bloque de resultado SHALL mostrar label de riesgo, score `%` de seguridad
estimada, barra de progreso y comparación de exposición vs la ruta rápida.

#### Scenario: ruta moderada
- **GIVEN** una ruta con `safety_label = moderate` y score 52%
- **THEN** se muestra "Ruta con riesgo moderado", "52% seguridad estimada", barra al 52% en color moderate, y "32% menos exposición que la ruta más rápida"

## ADDED: Explicación de riesgo

El sistema SHALL mostrar máximo 2 líneas con zonas de mayor exposición histórica
y horario pico, sin lenguaje de certeza absoluta.

#### Scenario: zonas críticas
- **GIVEN** un resultado con `critical_zones` y `peak_activity_range`
- **THEN** se muestra "Mayor exposición histórica cerca de Retiro y San Nicolás" y el horario pico

## ADDED: Ruta alternativa en el mapa

El mapa SHALL poder renderizar una ruta alternativa como línea punteada, fina,
gris azulada, por debajo de la ruta principal.

#### Scenario: demo con alternativa
- **GIVEN** se activa la ruta demo
- **THEN** además de la ruta principal coloreada por riesgo, se renderiza la alternativa punteada

## MODIFIED: Pins de origen y destino

Los pins SHALL usar verde `#00E599` (origen) y coral `#FF4D4D` (destino), con
borde para contraste y etiqueta flotante.

#### Scenario: demo Palermo → San Telmo
- **GIVEN** la ruta demo activa sin origin/destination en store
- **THEN** los pins se ubican en los extremos de la geometría con etiquetas "Palermo" y "San Telmo"

## MODIFIED: Leyenda del mapa

La leyenda SHALL ser un pill flotante con blur usando la paleta premium.
