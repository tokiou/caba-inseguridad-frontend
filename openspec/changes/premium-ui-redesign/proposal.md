# Premium UI Redesign — Sidebar, mapa y visualización de ruta

## Intent

Elevar la pantalla principal de SafeRoute BA a un look **dark premium** (tipo
Linear / Vercel / Arc / Uber): panel flotante con blur, menos cajas internas,
más aire visual, CTA fuerte, y mejor jerarquía entre búsqueda → resultado →
métricas.

## Scope

Solo **frontend / UI**. No se toca la lógica de routing, backend ni el contrato
de la API.

Incluye:

1. Nueva paleta de seguridad premium (`#00E599` / `#F5B82E` / `#FF4D4D` / `#7B8191`).
2. Rediseño del panel flotante (header, inputs route-planner, slider horario).
3. **Selector de perfil de ruta** (Rápida / Balanceada / Segura) — estado nuevo en frontend.
4. CTA principal verde fuerte + botón demo secundario.
5. Bloque de **resultado de riesgo** con score, barra y comparación vs ruta rápida.
6. **Métricas** en grilla 2×2 limpia.
7. **Explicación de riesgo** (zonas críticas / horario pico) en lenguaje de exposición histórica.
8. Mapa: pins de origen/destino con etiqueta, ruta alternativa punteada (mock), glow sutil en la ruta principal, leyenda pill rediseñada.

## Out of scope

Backend, PostGIS, Valhalla/OSRM, cálculo real de alternativas, heatmap real,
ML, auth, mobile completo (no romper layout en widths chicos, pero sin bottom-sheet).

## Approach

Componentizar el panel y el mapa. Reutilizar el `FloatingPanel` glass existente.
El perfil de ruta y la ruta alternativa se modelan como estado frontend +
datos mock, listos para conectar al backend más adelante.
