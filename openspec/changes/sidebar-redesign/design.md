# Design: Sidebar Redesign

---

## Decisiones técnicas

### Layout: absolute sobre el mapa
Se abandona el layout `flex` de `App.tsx` donde el sidebar era un `aside` hermano del mapa. El `MapView` pasará a ser `w-full h-full` y el panel se monta como un portal o simplemente como un `absolute` dentro del mismo contenedor. No se necesita portal ya que el z-index es suficiente.

```
App
└── div.relative.h-full.w-full   ← contenedor raíz
    ├── MapView           (absolute, inset-0)
    └── FloatingPanel     (absolute, top-4, left-4, z-30)
        ├── PanelHeader   (height: 48px, siempre visible)
        ├── SearchCard    (visible siempre)
        └── StatsCard     (visible solo si activeRoute, con animate-in)
```

### Glassmorphism tokens
```css
--panel-bg: rgba(13, 15, 23, 0.82)
--panel-blur: blur(20px)
--panel-border: rgba(255, 255, 255, 0.07)
--panel-shadow: 0 8px 32px rgba(0, 0, 0, 0.5)
```

### Animación del StatsCard
Usar CSS `@keyframes` vía Tailwind `animate-` o clases CSS manuales:
```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Controlado con un condicional React: `{activeRoute && <StatsCard />}`.

### Componentes afectados
| Componente | Acción |
|---|---|
| `App.tsx` | Cambiar layout a `relative` full-screen |
| `Sidebar.tsx` | Reemplazar por `FloatingPanel.tsx` |
| `RouteSearchForm.tsx` | Rediseñar inputs con divisor y pill shape |
| `RouteStats.tsx` | Agregar barra de progreso de safety score |
| `AddressAutocomplete.tsx` | Ajustar estilos del dropdown (glassmorphism) |

### Minimizar panel
Estado local `collapsed: boolean` en `FloatingPanel`. Cuando `collapsed`, el panel tiene `max-h-[48px]` con `overflow-hidden` y transición de `max-height`. No se usa `display:none` para mantener la transición CSS.
