# Proposal: Sidebar Redesign

**Change:** sidebar-redesign  
**Status:** proposed  
**Branch:** feat/sidebar-redesign-and-route-ui

---

## Intent

El sidebar actual es un panel fijo opaco que ocupa espacio de forma agresiva y no transmite la estética moderna del producto. El objetivo es rediseñarlo como un **panel flotante glassmorphism** que se integre visualmente con el mapa, con jerarquía tipográfica clara y animaciones suaves.

## Scope

**Incluye:**
- Reemplazar el panel fijo por un panel flotante con backdrop-blur
- Rediseñar el formulario de búsqueda con inputs más compactos y elegantes
- Mejorar la sección de estadísticas con iconografía clara y visualización de datos más rica
- Agregar transiciones de entrada/salida de los paneles
- Sección de header compacta con branding

**No incluye:**
- Diseño responsive/mobile (se hace en una iteración posterior)
- Modo claro
- Animación del mapa al buscar (ya implementada)

## Approach

Reemplazar el `aside` fijo por un panel `position: absolute` sobre el mapa en la esquina superior-izquierda. Usar `backdrop-filter: blur` con fondo semitransparente. El formulario de búsqueda tendrá una estética de "search bar" al estilo Google Maps pero con paleta oscura. Las estadísticas se mostrarán en un card separado debajo que aparece con animación cuando hay ruta activa.
