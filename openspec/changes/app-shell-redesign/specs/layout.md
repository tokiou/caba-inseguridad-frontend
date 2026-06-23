# Delta Spec: Layout — app-shell (sidebar + topbar + barra de rutas)

Domain: **sidebar** (layout general de la app)

---

## ADDED Requirements

### Requirement: App-shell con sidebar fijo

La app SHALL usar un layout de shell: un **sidebar fijo** full-height a la izquierda y un área de
mapa a la derecha que ocupa el resto. El sidebar SHALL contener marca, Origen/Destino, Prioridad de
la ruta, CTA "Buscar rutas", Capas del mapa y un footer con disclaimer + fuente. El panel flotante
anterior SHALL retirarse.

#### Scenario: Layout base

- **GIVEN** la app cargada
- **WHEN** se renderiza
- **THEN** hay un sidebar fijo a la izquierda y el mapa ocupa el área restante, sin panel flotante

### Requirement: Topbar con búsqueda y controles

Sobre el mapa SHALL haber una barra superior con: una **búsqueda de lugar** que al seleccionar
centra el mapa (`flyTo`) sin alterar origen/destino; un toggle **Día/Noche** que cambia el basemap; y
un control **Capas** que expone los toggles de capas.

#### Scenario: Búsqueda global centra el mapa

- **GIVEN** la barra superior
- **WHEN** el usuario elige un resultado de la búsqueda
- **THEN** el mapa hace `flyTo` a ese lugar y no cambia origen ni destino

#### Scenario: Día/Noche cambia el basemap

- **GIVEN** el basemap en Noche (oscuro)
- **WHEN** el usuario activa Día
- **THEN** el mapa pasa a un estilo claro y la ruta y marcadores se siguen viendo

### Requirement: Barra inferior de tarjetas de ruta

Sobre el borde inferior del mapa SHALL mostrarse una tarjeta por ruta (en orden más rápida →
balanceada → más segura, las presentes), con título por `kind`, badge de `risk_level`, tiempo,
distancia, comparación vs la más rápida, una mini-visualización (sparkline) y el nivel de exposición.
Click en una tarjeta SHALL seleccionar esa ruta (`selectedKind`) y resaltarla en el mapa. SHALL
tolerar 1..N rutas. Un enlace "Ver detalle de las rutas" SHALL abrir el detalle de la seleccionada.

#### Scenario: Seleccionar desde una tarjeta

- **GIVEN** la barra con las 3 tarjetas
- **WHEN** el usuario toca "Más segura"
- **THEN** `selectedKind` pasa a `safest`, la ruta se resalta y la tarjeta queda marcada

#### Scenario: Ver detalle

- **GIVEN** una ruta seleccionada
- **WHEN** el usuario activa "Ver detalle de las rutas"
- **THEN** se abre el detalle con métricas y la explicación (dónde/qué/cuándo) de esa ruta

### Requirement: Capas del mapa

El sidebar (y el control Capas del topbar) SHALL listar toggles para `Zonas de riesgo`,
`Robos y hurtos`, `Transporte público` y `Cámaras de seguridad`. `Zonas de riesgo` SHALL controlar
la visibilidad de los marcadores de la cuadra de mayor riesgo. Los toggles sin fuente de datos SHALL
persistir su estado pero NO afirmar datos inexistentes.

#### Scenario: Toggle de zonas de riesgo

- **GIVEN** "Zonas de riesgo" activado y una ruta seleccionada con `riskiest_segment`
- **WHEN** el usuario lo desactiva
- **THEN** desaparece el marcador de la cuadra de mayor riesgo del mapa

---

## REMOVED Requirements

### Requirement: Safety legend overlay

**Reason:** El shell muestra la información de riesgo en la barra de tarjetas; la leyenda flotante
sobre el mapa se retira.

**Migration:** El nivel de exposición por ruta se lee en cada tarjeta (`risk_level`).
