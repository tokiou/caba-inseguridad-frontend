# Spec: Route Search & Data

**Domain:** routing  
**Status:** implemented  
**Branch:** feat/map-ui

---

## Requirements

### Requirement: Address autocomplete with Nominatim

Both origin and destination inputs SHALL query the Nominatim OpenStreetMap API with a 300ms debounce after the user types ≥ 3 characters. Results SHALL be biased toward Buenos Aires, Argentina. Up to 5 suggestions SHALL appear in a dropdown.

#### Scenario: User types an address
- **GIVEN** the search form is rendered
- **WHEN** the user types 3 or more characters in an address input
- **THEN** a loading indicator appears, and within 300ms the Nominatim API is queried and results are displayed in a dropdown

#### Scenario: User selects a suggestion
- **GIVEN** the dropdown is open with results
- **WHEN** the user clicks a suggestion
- **THEN** the input shows the short form of the address, the dropdown closes, and `setOrigin`/`setDestination` is called in the store

---

### Requirement: Origin/destination swap

A swap button SHALL exchange origin and destination values when both are set.

#### Scenario: Swap when both addresses are selected
- **GIVEN** origin and destination are both set
- **WHEN** the user clicks the swap button
- **THEN** origin and destination are exchanged in the store and both inputs reflect the new values

---

### Requirement: Travel time picker

A range slider (0–23) SHALL allow the user to select the hour of travel. The selected hour SHALL be displayed formatted as `HH:00`. The default value SHALL be the current hour at app load.

#### Scenario: User adjusts the time slider
- **GIVEN** the search form is rendered
- **WHEN** the user drags the slider
- **THEN** the `hour` value updates in `routeStore` and the display reflects the selected hour

---

### Requirement: Route fetch

When the user clicks "Buscar ruta segura" with both origin and destination set, the app SHALL call `GET /api/route?from=lat,lng&to=lat,lng&hour=N` on the configured backend (`VITE_API_URL`). The result SHALL be cached by TanStack Query with a 5-minute stale time keyed by `(origin, destination, hour)`.

#### Scenario: Successful route fetch
- **GIVEN** origin, destination, and hour are set
- **WHEN** the user clicks the search button
- **THEN** the backend is called, the response is stored in `routeStore.activeRoute`, and the map renders the route

#### Scenario: Backend unavailable
- **GIVEN** `VITE_API_URL` is unreachable
- **WHEN** the fetch fails
- **THEN** an error message is shown in the sidebar and no route is drawn

---

### Requirement: Route state management

`routeStore` (Zustand) SHALL hold: `origin`, `destination`, `hour`, `activeRoute`, `selectedSegment`. `mapStore` SHALL hold map viewport state (`center`, `zoom`). These stores SHALL be the single source of truth for all route-related UI state.
