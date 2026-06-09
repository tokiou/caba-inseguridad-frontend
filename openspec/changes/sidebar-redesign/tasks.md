# Tasks: Sidebar Redesign

- [ ] Cambiar `App.tsx` a layout `relative` full-screen (eliminar flex row)
- [ ] Crear `components/panel/FloatingPanel.tsx` con glassmorphism, collapse y z-index
- [ ] Crear `components/panel/PanelHeader.tsx` con logo y botón minimizar
- [ ] Crear `components/panel/SearchCard.tsx` con pill shape y divisor horizontal
- [ ] Rediseñar inputs en `AddressAutocomplete.tsx` (sin borde sólido, con glassmorphism)
- [ ] Rediseñar `TimePicker.tsx` para formato compacto de una línea
- [ ] Crear `components/panel/StatsCard.tsx` con animación slide-up al aparecer
- [ ] Agregar barra de progreso de safety score en `StatsCard`
- [ ] Actualizar `RouteStats.tsx` para usar `StatsCard` como wrapper
- [ ] Eliminar `Sidebar.tsx` (reemplazado por `FloatingPanel`)
- [ ] Verificar que el mapa ocupa 100% del viewport
- [ ] Confirmar que la leyenda no queda tapada por el panel flotante
- [ ] Build y smoke test visual con `npm run dev`
