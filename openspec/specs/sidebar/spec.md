# Spec: Sidebar v1

**Domain:** sidebar  
**Status:** implemented — superseded by `changes/sidebar-redesign`  
**Branch:** feat/map-ui

---

## Requirements

### Requirement: Fixed left panel layout

The sidebar SHALL be a fixed-width (`380px`) left panel with a dark background (`#12141c`), occupying the full viewport height. The map SHALL fill the remaining horizontal space.

---

### Requirement: Route search form

The sidebar SHALL render the `RouteSearchForm` at the top, containing the origin/destination autocomplete inputs, the swap button, the time picker, and the search button.

#### Scenario: Search button disabled without addresses
- **GIVEN** one or both address inputs are empty
- **WHEN** the form is rendered
- **THEN** the "Buscar ruta segura" button is disabled and non-interactive

---

### Requirement: Route statistics panel

When `activeRoute` is set, the sidebar SHALL render a stats panel showing:
- Safety label (colored badge matching the route's `safety_label`)
- Distance in km/m
- Estimated travel time in minutes
- Total robbery count for the route or selected segment
- Armed robbery count and percentage

#### Scenario: Stats show segment data on map click
- **GIVEN** a route is active
- **WHEN** the user clicks a segment on the map
- **THEN** `selectedSegment` is set in `routeStore` and the stats panel shows that segment's robbery data

#### Scenario: Stats show full route data by default
- **GIVEN** a route is active and no segment is selected
- **WHEN** the stats panel renders
- **THEN** `summary` totals from the route response are displayed

---

### Requirement: Error state

If the route fetch fails, the sidebar SHALL show a dismissible error message indicating that the server may be unavailable.
