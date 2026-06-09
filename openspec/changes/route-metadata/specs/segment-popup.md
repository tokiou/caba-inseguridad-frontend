# Delta Spec: Segment Metadata Popup

---

## ADDED Requirements

### Requirement: Popup de metadatos al hacer clic en segmento

Al hacer clic en cualquier segmento de la ruta activa, SHALL aparecer un popup de MapLibre (`maplibregl.Popup`) anclado en las coordenadas del clic. El popup SHALL contener:

1. **Indicador de nivel de seguridad**: dot de color + label textual (ej. "● Riesgo moderado")
2. **Conteo de robos**: ícono de alerta + número + "robos en este segmento"
3. **Robos con armas**: ícono de target + número + porcentaje entre paréntesis
4. **Horario de mayor actividad**: ícono de reloj + top-1 hora con mayor conteo (ej. "Pico: 22:00 – 23:00")
5. **Mini gráfico de barras horizontales** con los `peak_hours` (máximo 5 barras), donde la barra más alta representa el horario más peligroso. Las barras se colorean con la paleta de seguridad (rojo = más robos).

El popup SHALL cerrarse al hacer clic en el mapa fuera de la ruta, al presionar Escape, o al abrir otro popup.

#### Scenario: Usuario hace clic en segmento peligroso
- **GIVEN** la ruta está activa con segmentos de distintos niveles
- **WHEN** el usuario hace clic sobre un segmento con `safety_score: 0.2`
- **THEN** aparece un popup rojo con el conteo de robos, % con armas, y el pico horario de ese segmento

#### Scenario: Popup cierra al hacer clic fuera
- **GIVEN** un popup está abierto
- **WHEN** el usuario hace clic en el mapa fuera de la ruta
- **THEN** el popup se cierra y `selectedSegment` se limpia en el store

#### Scenario: Solo un popup a la vez
- **GIVEN** hay un popup abierto en el segmento A
- **WHEN** el usuario hace clic en el segmento B
- **THEN** el popup del segmento A se cierra y abre el del segmento B en la nueva posición

---

### Requirement: Estilo del popup coherente con el panel

El popup SHALL tener el mismo glassmorphism que el panel flotante: fondo oscuro semitransparente, `backdrop-filter: blur`, borde sutil. El puntero/flecha del popup SHALL ser mínimo o eliminado. El popup NO SHALL usar el estilo por defecto de MapLibre.

#### Scenario: Popup renderiza con estilos del design system
- **GIVEN** el usuario hace clic en un segmento
- **WHEN** el popup aparece
- **THEN** el popup tiene fondo `rgba(13,15,23,0.90)` con blur, sin el borde blanco por defecto de MapLibre
