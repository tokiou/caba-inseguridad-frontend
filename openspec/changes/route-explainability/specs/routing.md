# Delta Spec: Routing — metadata explicativa por ruta

Domain: **routing**

---

## ADDED Requirements

### Requirement: Tipos de metadata explicativa

El tipo `SafeRoute` SHALL incluir los campos de metadata explicativa del contrato:
`riskiest_segment?` (`RiskiestSegment`), `segments?` (`RouteSegment[]`), `dominant_factor`
(`DominantFactor`), `armed_share_percent` (`number`) y `time_of_day_risk?` (`TimeOfDayRisk`). Los
campos marcados opcionales SHALL tiparse como tales porque el backend los omite en rutas sin tramos.
SHALL existir el tipo `DominantFactor = "robbery" | "theft" | "threats" | "none"`.

#### Scenario: Ruta con metadata completa

- **GIVEN** una respuesta con una ruta que tiene tramos
- **WHEN** el frontend la tipa
- **THEN** `riskiest_segment`, `segments`, `dominant_factor`, `armed_share_percent` y
  `time_of_day_risk` están disponibles y tipados

#### Scenario: Ruta sin tramos

- **GIVEN** una ruta sin tramos
- **WHEN** el frontend la procesa
- **THEN** `riskiest_segment` y `time_of_day_risk` pueden venir ausentes y el código no asume su
  presencia

### Requirement: Composición de prosa desde metadata

El frontend SHALL componer los textos explicativos a partir de la metadata (el backend NO envía
texto), en lenguaje de **exposición histórica relativa**. Los conteos (`robbery_count`,
`armed_count`, etc.) y `armed_share_percent` / `dominant_factor` SHALL presentarse como exposición
relativa y NUNCA como conteo absoluto de delitos en la ruta.

#### Scenario: Frase del factor dominante

- **GIVEN** una ruta con `dominant_factor: "theft"` y `armed_share_percent: 4.3`
- **WHEN** se compone la explicación
- **THEN** el texto comunica que predomina el hurto y que ~4% de los incidentes fueron con arma,
  enmarcado como exposición relativa

#### Scenario: Factor dominante "none"

- **GIVEN** una ruta con `dominant_factor: "none"`
- **WHEN** se compone la explicación
- **THEN** no se muestra una frase de factor dominante
