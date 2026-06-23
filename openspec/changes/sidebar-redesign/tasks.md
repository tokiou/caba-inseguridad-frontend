# Tasks: Sidebar Redesign

- [x] Cambiar `App.tsx` a layout `relative` full-screen (eliminar flex row)
- [x] Crear `components/panel/FloatingPanel.tsx` con glassmorphism, collapse y z-index
- [x] Crear `components/panel/PanelHeader.tsx` con logo y botón minimizar
- [x] Crear `components/panel/SearchCard.tsx` con pill shape y divisor horizontal
- [x] Rediseñar inputs en `AddressAutocomplete.tsx` (sin borde sólido, con glassmorphism)
- [x] Rediseñar `TimePicker.tsx` para formato compacto de una línea
- [x] Crear `components/panel/StatsCard.tsx` con animación slide-up al aparecer
- [x] Agregar barra de progreso de safety score en `StatsCard`
- [x] Actualizar `RouteStats.tsx` para usar `StatsCard` como wrapper
- [x] Eliminar `Sidebar.tsx` (reemplazado por `FloatingPanel`)
- [x] Verificar que el mapa ocupa 100% del viewport
- [x] Confirmar que la leyenda no queda tapada por el panel flotante
- [x] Build y smoke test visual con `npm run dev`
