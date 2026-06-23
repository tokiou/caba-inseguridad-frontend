# Delta Spec: Panel — explicación del porqué (dónde / qué / cuándo)

Domain: **sidebar**

---

## ADDED Requirements

### Requirement: Bloque de explicación de la ruta seleccionada

El panel SHALL mostrar, para la ruta seleccionada, una explicación compuesta desde la metadata, con
hasta tres ejes:

1. **Dónde** — desde `riskiest_segment`: nivel de la cuadra, robos y con-arma de ese tramo, más una
   acción "ver en el mapa" que enfoca `riskiest_segment.point`.
2. **Qué** — desde `dominant_factor` y `armed_share_percent`.
3. **Cuándo** — mini-visualización de `time_of_day_risk` por las 4 franjas con `peak_bucket`
   resaltada.

Cada eje SHALL renderizar solo si su metadata existe. Si toda la metadata falta, el bloque SHALL
omitirse sin romper el layout. Todos los textos SHALL usar lenguaje de exposición histórica
relativa.

#### Scenario: Explicación completa

- **GIVEN** la ruta seleccionada con `riskiest_segment`, `dominant_factor: "robbery"` y
  `time_of_day_risk`
- **WHEN** el panel renderiza
- **THEN** se ve dónde (la cuadra peor + "ver en el mapa"), qué (predomina robos, % con arma) y
  cuándo (franjas con la peor resaltada)

#### Scenario: Metadata parcial

- **GIVEN** una ruta sin `time_of_day_risk`
- **WHEN** el panel renderiza la explicación
- **THEN** muestra los ejes disponibles y omite el "cuándo" sin romper el layout

### Requirement: Mini-visualización de riesgo por franja

El bloque "cuándo" SHALL mostrar las cuatro franjas (`morning`, `afternoon`, `evening`, `night`)
con su `risk_level` por color y la `peak_bucket` resaltada.

#### Scenario: Pico nocturno

- **GIVEN** `time_of_day_risk.peak_bucket: "night"`
- **WHEN** se renderiza la mini-visualización
- **THEN** la franja noche aparece resaltada como la de mayor exposición
