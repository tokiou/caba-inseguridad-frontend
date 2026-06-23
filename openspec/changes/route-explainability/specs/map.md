# Delta Spec: Map — marcador de la cuadra de mayor riesgo

Domain: **map**

---

## ADDED Requirements

### Requirement: Marcador de `riskiest_segment` de la ruta seleccionada

Cuando la ruta seleccionada tenga `riskiest_segment`, el mapa SHALL mostrar un marcador de alerta
sobre `riskiest_segment.point` (mediopunto del tramo). El marcador SHALL distinguirse de los pines de
origen/destino. SHALL actualizarse al cambiar `selectedKind` y desaparecer si la ruta no tiene
`riskiest_segment`.

#### Scenario: Marcador presente para la ruta seleccionada

- **GIVEN** la ruta seleccionada con `riskiest_segment`
- **WHEN** el mapa renderiza
- **THEN** aparece un marcador de alerta en `riskiest_segment.point`

#### Scenario: Cambio de ruta mueve el marcador

- **GIVEN** un marcador sobre la cuadra peor de `balanced`
- **WHEN** el usuario selecciona `safest`
- **THEN** el marcador se reubica en el `riskiest_segment.point` de `safest` (o desaparece si esa
  ruta no lo trae)

### Requirement: Enfocar la cuadra de mayor riesgo

El frontend SHALL permitir centrar el mapa (`flyTo`) en `riskiest_segment.point` de la ruta
seleccionada desde una acción del panel ("ver en el mapa").

#### Scenario: Acción "ver en el mapa"

- **GIVEN** el panel mostrando la cuadra de mayor riesgo de la ruta seleccionada
- **WHEN** el usuario activa "ver en el mapa"
- **THEN** el mapa hace `flyTo` al `riskiest_segment.point`

---

## MODIFIED Requirements

### Requirement: Render de hasta 4 rutas coloreadas por `kind`

El coloreo de la polilínea SHALL seguir siendo por `kind` (no se recolorea por cuadra con
`segments[]` en este change). `segments[]` queda tipado y disponible para un heatmap futuro, pero
NO altera el color de las líneas ahora.

#### Scenario: Color por kind se mantiene

- **GIVEN** rutas con `segments[]` disponible
- **WHEN** el mapa las dibuja
- **THEN** cada línea conserva el color de su `kind`; no hay recoloreo por tramo
