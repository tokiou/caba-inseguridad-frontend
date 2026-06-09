# Spec: Map View

**Domain:** map  
**Status:** implemented  
**Branch:** feat/map-ui

---

## Requirements

### Requirement: Interactive dark map

The map SHALL render using MapLibre GL JS with a dark CartoDB dark-matter tile style as the base layer. The map SHALL be full-height and fill all available horizontal space outside the sidebar. The initial center SHALL be Buenos Aires (`[-58.3816, -34.6037]`) at zoom 13.

#### Scenario: Map loads on startup
- **GIVEN** the user opens the application
- **WHEN** the app finishes mounting
- **THEN** a full-screen dark map of Buenos Aires is rendered with navigation controls in the bottom-right corner

---

### Requirement: Route layer with safety coloring

The map SHALL display an active route as a GeoJSON LineString with color interpolated from the `safety_score` property of each feature using MapLibre paint expressions.

Color scale:
| `safety_score` | Color |
|---|---|
| 0.0 | `#ef4444` (danger) |
| 0.4 | `#f59e0b` (moderate) |
| 0.7 | `#22c55e` (safe) |

The route SHALL also render a black casing layer underneath for contrast.

#### Scenario: Route renders with color gradient
- **GIVEN** the backend returns a GeoJSON FeatureCollection with `safety_score` per feature
- **WHEN** `activeRoute` is set in the store
- **THEN** the route is drawn on the map with each segment colored according to its safety score

#### Scenario: Map fits route bounds
- **GIVEN** a route is set
- **WHEN** the route layer updates
- **THEN** the map animates to fit all route coordinates with 80px padding

---

### Requirement: Origin and destination markers

The map SHALL render custom pin markers for origin (green, labeled "A") and destination (red, labeled "B") when those values are present in `routeStore`.

#### Scenario: Markers appear on address selection
- **GIVEN** the user selects an address in the search form
- **WHEN** `setOrigin` or `setDestination` is called in the store
- **THEN** a colored pin appears at the corresponding coordinates on the map

---

### Requirement: Safety legend overlay

The map SHALL show a fixed overlay in the bottom-left with the four safety levels (Seguro, Moderado, Peligroso, Sin datos) and their corresponding colors.

#### Scenario: Legend is always visible
- **GIVEN** the map is loaded
- **WHEN** any state changes
- **THEN** the safety legend remains visible with no interaction required

---

### Requirement: Map context

A React context (`MapContext`) SHALL expose the `maplibregl.Map` instance to child components rendered after the `load` event, enabling `RouteLayer`, `MarkersLayer`, and other overlays to interact with the map imperatively.
