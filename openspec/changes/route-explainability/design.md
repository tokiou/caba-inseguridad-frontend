# Design: Explicabilidad de rutas

**Change:** route-explainability

---

## 1. Metadata nueva en `routes[]`

| Campo | Tipo | Semántica | Omisión |
|-------|------|-----------|---------|
| `riskiest_segment` | `RiskiestSegment?` | La cuadra de mayor `risk_score` (== `max_edge_risk`). `point` = mediopunto del tramo + desglose de delitos de ESE tramo. Responde "más insegura **por esta cuadra**". | Solo si la ruta no tiene tramos. |
| `segments` | `RouteSegment[]?` | Vista mínima por cuadra en orden (`risk_score`, `robbery_count`, `length_meters`, `point`). Σ `length_meters` ≈ `distance_meters`. | Puede faltar. |
| `dominant_factor` | `DominantFactor` | Delito con mayor conteo (`robbery\|theft\|threats\|none`). | Siempre presente; `none` si no hay conteos. |
| `armed_share_percent` | `number` | `armed_count / crime_count * 100`. | Siempre presente. |
| `time_of_day_risk` | `TimeOfDayRisk?` | Riesgo de ESTA ruta en las 4 franjas (para el `weekday_type` resuelto) + `peak_bucket`. Grano de franja, no horario exacto. | Solo si la ruta no tiene tramos. |

## 2. Decisiones técnicas

### 2.1 El FE compone la prosa, el backend manda métricas

El backend no envía texto. `utils/routeExplain.ts` traduce métricas → frases en español, en lenguaje
de **exposición histórica relativa**. Helpers puros (sin JSX) para poder testearlos:

- `dondePhrase(route)` → "Sube a {nivel} por una cuadra con {robbery_count} robos
  ({armed_count} con arma)." usando `riskiest_segment`.
- `quePhrase(route)` → "Predomina {factor}; {armed_share_percent}% de los incidentes con arma."
- `cuandoPhrase(route)` → "Mayor exposición de {sustantivo de peak_bucket}."

Etiquetas:

```
DOMINANT_FACTOR_LABELS = { robbery: "robos", theft: "hurtos", threats: "amenazas", none: "—" }
BUCKET_NOUN = { morning: "la mañana", afternoon: "la tarde", evening: "la tardecita", night: "la noche" }
```

### 2.2 Conteos = exposición relativa, nunca eventos

`riskiest_segment.robbery_count`, `dominant_factor` y `armed_share_percent` son comparaciones
relativas válidas (regla del contrato §4). La UI los enmarca como exposición/intensidad y mantiene
el disclaimer; nunca dice "N delitos en esta ruta".

### 2.3 Color por `kind`, no heatmap (por ahora)

Se conserva el coloreo de la polilínea por `kind` (identidad visual ya elegida). `segments[]` se
tipa y queda disponible, pero **no** se recolorea la línea por cuadra en este change. Lo que sí se
agrega es un **marcador de alerta** sobre `riskiest_segment.point` de la ruta seleccionada, que es la
señal de mayor valor y menor costo visual. Heatmap por cuadra = mejora futura.

### 2.4 Tolerancia a campos ausentes

`riskiest_segment`, `segments` y `time_of_day_risk` se omiten en rutas sin tramos. Cada bloque del
explainer y el marcador del mapa renderizan **solo si su fuente existe**; si todo falta, el explainer
no aparece y el layout no se rompe. `dominant_factor: "none"` oculta la frase de "qué".

### 2.5 `time_of_day_risk` como mini-visual

Cuatro barras (mañana/tarde/tardecita/noche) con altura/relleno por `risk_score` y color por
`risk_level`; la franja `peak_bucket` se resalta. Comunica "cuándo conviene/no conviene" sin
prometer seguridad.

### 2.6 "Ver en el mapa"

El bloque "dónde" incluye una acción que centra el mapa (`flyTo`) en `riskiest_segment.point`. Se
implementa con un setter de "punto a enfocar" en el store o un evento al mapa; mínimo acoplamiento:
el `MarkersLayer`/mapa lee el punto del store y hace `flyTo`.

## 3. Riesgos / trade-offs

- **Densidad del panel.** El flat-minimal es aireado; el explainer agrega contenido. Se mantiene
  jerarquía con eyebrows + divisores finos y se limita a 3 frases + mini-visual.
- **No heatmap.** Se pospone el recoloreo por cuadra para no romper la identidad por `kind`; si se
  pide, `segments[]` ya está tipado para habilitarlo.
