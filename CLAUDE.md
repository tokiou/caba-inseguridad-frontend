# caba-inseguridad-frontend

Frontend de rutas seguras para CABA. Muestra rutas de A→B coloreadas por nivel de peligrosidad, con panel lateral de estadísticas de robos por horario y zona.

---

## Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | **Vite + React 18 + TypeScript** | App 100% client-side — el mapa vive en el browser, SSR no aporta valor real aquí |
| Mapas | **MapLibre GL JS** | Fork open-source de Mapbox GL; misma API, sin costo por tile requests, soporte nativo de capas vectoriales para colorear segmentos de ruta |
| Estilos de mapa | **Protomaps / OpenFreeMap tiles** | Tiles gratis, estilo oscuro moderno compatible con la paleta de seguridad |
| UI | **Tailwind CSS v4 + shadcn/ui** | Diseño moderno, componentes accesibles, fácil de customizar |
| Estado | **Zustand** | Liviano, ideal para estado del mapa (origen, destino, ruta activa, filtros de horario) |
| Fetching | **TanStack Query v5** | Caché de rutas, refetch automático, manejo de loading/error states |
| Geocoding | **Nominatim (OpenStreetMap)** | Gratuito, cubre CABA perfectamente para autocompletar direcciones |
| Formularios | **React Hook Form + Zod** | Validación del input origen/destino |
| Iconos | **Lucide React** | Liviano, bien mantenido |
| Testing | **Vitest + Testing Library** | Integrado con Vite, rápido |

---

## Estructura del proyecto

```
src/
├── app/                    # Punto de entrada, rutas (React Router v7)
│   └── routes/
│       ├── index.tsx       # Vista principal (mapa)
│       └── about.tsx       # Info del proyecto
│
├── components/
│   ├── map/                # Todo lo relacionado al mapa
│   │   ├── MapView.tsx     # Componente raíz del mapa (MapLibre)
│   │   ├── RouteLayer.tsx  # Renderiza la ruta coloreada sobre el mapa
│   │   ├── SafetyLegend.tsx # Leyenda de colores de peligrosidad
│   │   └── MapControls.tsx # Zoom, geolocalización
│   │
│   ├── route/              # Flujo de búsqueda de ruta
│   │   ├── RouteSearchForm.tsx  # Input origen + destino + horario
│   │   ├── AddressAutocomplete.tsx  # Autocomplete con Nominatim
│   │   └── TimePicker.tsx   # Selector de horario para stats
│   │
│   ├── sidebar/            # Panel lateral de info
│   │   ├── Sidebar.tsx     # Container del panel
│   │   ├── RouteStats.tsx  # Estadísticas de la ruta seleccionada
│   │   ├── SegmentDetail.tsx # Detalle de un segmento al clickear
│   │   └── RobberyBadge.tsx  # Badge con conteo de robos / con armas
│   │
│   └── ui/                 # Componentes genéricos (shadcn)
│
├── hooks/
│   ├── useRoute.ts         # Fetch + cache de la ruta desde el backend
│   ├── useGeolocation.ts   # GPS del usuario
│   └── useAddressSearch.ts # Debounce + query Nominatim
│
├── services/
│   ├── api.ts              # Cliente HTTP base (fetch wrapper)
│   ├── routeService.ts     # Endpoints del backend (GET /route, etc.)
│   └── geocodingService.ts # Nominatim queries
│
├── store/
│   ├── mapStore.ts         # Centro del mapa, zoom, marcadores
│   └── routeStore.ts       # Origen, destino, ruta activa, segmento seleccionado
│
├── types/
│   ├── route.ts            # Route, Segment, SafetyLevel, RobberyStats
│   └── map.ts              # Coords, BBox, GeoJSON helpers
│
└── utils/
    ├── safetyColors.ts     # Mapeo SafetyLevel → color hex para MapLibre
    └── formatStats.ts      # Formateo de números de robos, porcentajes
```

---

## Paleta de colores de seguridad

| Nivel | Color | Hex |
|-------|-------|-----|
| Seguro | Verde | `#22c55e` |
| Moderado | Amarillo | `#f59e0b` |
| Peligroso | Rojo | `#ef4444` |
| Sin datos | Gris | `#6b7280` |

La ruta se renderiza como una capa de líneas en MapLibre con `line-color` interpolado según el `safety_score` de cada segmento GeoJSON que devuelve el backend.

---

## Contrato esperado del backend

El frontend asume que el backend expone algo como:

```
GET /api/route?from=lat,lng&to=lat,lng&hour=18
```

Respuesta (GeoJSON FeatureCollection):
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "LineString", "coordinates": [...] },
      "properties": {
        "safety_score": 0.3,
        "robbery_count": 12,
        "armed_robbery_count": 4,
        "hour_range": "17:00-19:00"
      }
    }
  ],
  "summary": {
    "total_robbery_count": 25,
    "armed_robbery_count": 8,
    "safety_label": "moderate",
    "distance_km": 2.4,
    "estimated_minutes": 28
  }
}
```

Ajustar `services/routeService.ts` cuando se conozca el contrato real.

---

## Comandos

```bash
npm run dev       # Dev server (Vite)
npm run build     # Build de producción
npm run test      # Tests (Vitest)
npm run lint      # ESLint
```

---

## Regla: Spec-Driven Development (OpenSpec)

**Toda feature nueva o cambio significativo DEBE tener su spec escrita ANTES de implementar.**

Seguimos el formato [OpenSpec (Fission-AI)](https://github.com/Fission-AI/OpenSpec):

```
openspec/
├── specs/          # Source of truth — specs de lo ya implementado
│   └── <domain>/spec.md
└── changes/        # Propuestas activas — specs ANTES de codear
    └── <change-name>/
        ├── proposal.md   ← intent, scope, approach
        ├── design.md     ← decisiones técnicas
        ├── tasks.md      ← checklist atómico de implementación
        └── specs/        ← delta: ADDED / MODIFIED / REMOVED
```

### Flujo obligatorio

1. **Proponer** → crear `openspec/changes/<nombre>/proposal.md` con intent, scope, approach
2. **Especificar** → escribir delta specs en `changes/<nombre>/specs/` con scenarios GIVEN/WHEN/THEN
3. **Diseñar** → documentar decisiones técnicas en `design.md`
4. **Tareas** → listar pasos atómicos en `tasks.md`
5. **Implementar** → codear siguiendo la spec, NO inventar sobre la marcha
6. **Archivar** → mover delta a `openspec/specs/` una vez mergeado a `dev`

### Reglas

- Ningún componente nuevo entra a `dev` sin su spec en `openspec/`
- Los scenarios usan lenguaje normativo: **SHALL** para requerimientos, **GIVEN/WHEN/THEN** para scenarios
- Si durante la implementación algo cambia respecto a la spec, actualizar la spec primero

---

## Decisiones de diseño clave

- **Sin SSR**: El mapa requiere `window`/`document`, no tiene sentido renderizarlo en servidor.
- **MapLibre sobre Mapbox**: Evita vendor lock-in y costos de API key con límites de uso.
- **Zustand sobre Redux**: El estado del mapa es simple (no hay acciones complejas). Zustand es suficiente y más legible.
- **TanStack Query para rutas**: Las rutas pueden cachearse por `(from, to, hour)` — evita refetch innecesario al cambiar horario por pocos minutos.
- **GeoJSON nativo**: MapLibre consume GeoJSON directamente, así que el backend devuelve GeoJSON y el frontend no transforma nada — menos código, menos bugs.
