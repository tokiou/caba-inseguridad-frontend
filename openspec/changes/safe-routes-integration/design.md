# Design: Integración del backend real de rutas seguras

**Change:** safe-routes-integration

---

## 1. Contrato (resumen operativo)

`GET {BASE_URL}/api/v1/routes/safe`

| Param        | Req | Nota |
|--------------|-----|------|
| `origin_lat`, `origin_lng` | sí | WGS84, dentro de CABA. |
| `dest_lat`, `dest_lng`     | sí | WGS84, dentro de CABA. |
| `datetime`   | no  | RFC3339 con offset (ej. `2026-06-12T23:00:00-03:00`). Si falta → hora actual AR. |

Respuesta 200: `SafeRoutesResponse` con `routes: SafeRoute[]` de longitud **1..4**. Hay que
iterar `routes[]` y buscar cada ruta por su campo `kind`; **nunca** asumir índices ni que vienen 4
(`least_safe_candidate` puede faltar).

Errores: envelope `{ error, message }`. Códigos: `invalid_request`,
`origin_or_destination_outside_walkable_graph` (400), `route_not_found` (404),
`risk_model_unavailable` (503), `internal_error` (500). Header `X-Request-Id` para soporte.

## 2. Decisiones técnicas

### 2.1 Riesgo, no seguridad

Se elimina `safety_score` (mayor = mejor) y se adopta `risk_score`/`risk_level` (mayor = peor). En
la UI el porcentaje mostrado es **exposición** (`risk_score * 100`), y la barra se llena hacia el
rojo a mayor riesgo. No se muestra ningún "% de seguridad".

Mapeo de color por nivel de riesgo:

| `risk_level` | Color |
|--------------|-------|
| `low`        | `#00E599` (verde) |
| `moderate`   | `#F5B82E` (ámbar) |
| `high`       | `#FF4D4D` (rojo) |

### 2.2 Color de las líneas: por `kind` (no por `risk_level`)

En el mapa, cada ruta se colorea por `kind` siguiendo la sugerencia del contrato §7, porque la
pregunta del usuario es "¿qué alternativa elijo?", no "¿de qué color es el riesgo agregado?":

| `kind`                 | Estilo |
|------------------------|--------|
| `safest`               | Verde `#00E599`, sólida, z-index alto. |
| `balanced`             | Ámbar `#F5B82E`, sólida. |
| `fastest`              | Rojo `#FF4D4D`, sólida. |
| `least_safe_candidate` | Gris `#7B8191`, **punteada**, opacidad baja (contraste, no recomendación). |

El `risk_level` se usa para los badges/colores **en el panel y el popup**. La leyenda del mapa pasa
a explicar los tipos de ruta.

### 2.3 `crime_metrics` nunca como conteo

Regla dura del contrato (§4): un mismo delito influye varios tramos y cuenta en cada uno, así que
los números son sumas de exposición, no eventos. La UI:

- **No** muestra "X robos" / "X con armas" como números absolutos de la ruta.
- Si se muestra `crime_metrics`, es como **composición relativa** (proporciones dentro de
  `crime_count`) o intensidad para comparar rutas, etiquetada "exposición estimada".
- El argumento principal de cada alternativa son las métricas comparativas
  (`extra_distance_vs_fastest_meters`, `risk_reduction_vs_fastest_percent`).

### 2.4 `datetime` desde el selector de horario

El picker sigue siendo una hora 0–23 (no se agrega calendario). Se construye el `datetime` como
`YYYY-MM-DDT{HH}:00:00-03:00` usando la **fecha actual en `America/Argentina/Buenos_Aires`**
(vía `Intl.DateTimeFormat` con `timeZone`), para que el `time_bucket`/`weekday_type` que resuelve el
backend sea consistente con lo que ve el usuario. Se evita `toISOString()` (UTC 'Z') para no
desfasar la franja horaria.

### 2.5 Estado: una respuesta, una selección

`routeStore` deja de tener `activeRoute`/`alternativeRoute` (modelo viejo) y pasa a:

```ts
response: SafeRoutesResponse | null   // la respuesta completa del backend (o mock)
selectedKind: RouteKind               // ruta enfatizada / detallada (default 'balanced')
hiddenKinds: RouteKind[]              // toggles de visibilidad
popupKind: RouteKind | null           // ruta con popup abierto
```

Al setear `response`, si `selectedKind` no está presente en `routes[]`, se cae al primer `kind`
disponible. Helper `routeByKind(kind)` para los consumidores.

### 2.6 Render multi-ruta en MapLibre

`line-dasharray` no es data-driven, así que se separan dos fuentes:

- `routes` (sólidas: `fastest`/`balanced`/`safest` visibles).
- `routes-dashed` (`least_safe_candidate` visible).

Capas sobre la sólida: casing oscuro, glow solo para la seleccionada (`filter` por `selected`),
y la línea principal con color `match` por `kind` y ancho `case` según `selected`. `line-sort-key`
prioriza seleccionada > `safest` > `balanced` > `fastest`. Click en cualquier ruta (sólida o
punteada) selecciona ese `kind` y abre el popup de ruta.

### 2.7 Manejo de errores en la UI

| Código | Mensaje al usuario |
|--------|--------------------|
| `invalid_request` / `origin_or_destination_outside_walkable_graph` | "Elegí puntos sobre calles de CABA y reintentá." |
| `route_not_found` | "No encontramos una ruta caminable entre esos puntos." |
| `risk_model_unavailable` | "El servicio de riesgo no está disponible. Probá de nuevo en unos minutos." |
| `internal_error` / otros | "Ocurrió un error. Reintentá." + se loguea `X-Request-Id`. |

### 2.8 CORS / puertos

Dev server en `http://localhost:8081` (script `dev` con `--port 8081 --strictPort`). `VITE_API_URL`
por defecto `http://localhost:8080`. Si más adelante se necesita otro origen, es un cambio en el
backend (`AllowedOrigins`), fuera de este change.

## 3. Riesgos / trade-offs

- **Pérdida de coloreado por-segmento.** El contrato real no trae datos por tramo, así que el efecto
  "ruta multicolor" desaparece. Se compensa con el peor tramo (`max_edge_risk`,
  `high_risk_edge_percent`) en el popup. Aceptado: refleja lo que el backend realmente entrega.
- **El picker no fija fecha.** Usar "hoy" puede dar `weekend` distinto al que el usuario imagina.
  Aceptable para v1; un date picker es scope futuro.
- **Migración amplia.** Se tocan tipos, store, servicio, mapa, popup y panel a la vez. El mock
  reformado permite validar todo el flujo sin backend.
