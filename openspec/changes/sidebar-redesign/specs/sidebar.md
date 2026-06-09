# Delta Spec: Sidebar Redesign

---

## MODIFIED Requirements

### Requirement: Panel flotante en lugar de sidebar fijo
_Reemplaza: sidebar/spec.md → "Fixed left panel layout"_

El panel de control SHALL renderizarse como un elemento `position: absolute` flotando sobre el mapa en la esquina superior-izquierda. SHALL tener un fondo semitransparente (`rgba` oscuro) con `backdrop-filter: blur(16px)` y borde sutil con opacidad. El panel SHALL tener un ancho máximo de `400px` y altura automática según contenido, nunca mayor a `calc(100vh - 2rem)` con scroll interno si es necesario.

#### Scenario: Panel visible sobre el mapa
- **GIVEN** la app carga
- **WHEN** el mapa termina de renderizar
- **THEN** el panel flotante es visible sobre el mapa con efecto glassmorphism, sin tapar más del 40% del viewport horizontal

---

### Requirement: Barra de búsqueda compacta
_Reemplaza: sidebar/spec.md → "Route search form"_

El formulario SHALL tener una forma de "pill" o card con bordes redondeados (`border-radius: 16px`). Los inputs de origen y destino SHALL estar separados visualmente por un divisor horizontal fino, no por margen. El botón de swap SHALL estar en el centro del divisor como un botón circular pequeño. El time picker SHALL estar colapsado en una línea compacta con icono de reloj.

#### Scenario: Formulario compacto con divisor
- **GIVEN** el panel está visible
- **WHEN** se renderizan los dos inputs de dirección
- **THEN** aparecen separados por una línea horizontal con un botón de swap circular centrado sobre ella

#### Scenario: Input en foco muestra dropdown con blur
- **GIVEN** el usuario hace foco en un input
- **WHEN** escribe 3+ caracteres
- **THEN** el dropdown de sugerencias aparece con el mismo efecto glassmorphism que el panel

---

## ADDED Requirements

### Requirement: Card de estadísticas separado del formulario

Las estadísticas de la ruta SHALL renderizarse en un **card independiente** debajo del formulario, con una animación de entrada (`translate-y` + `opacity`) al aparecer. Este card SHALL estar vacío/oculto cuando no hay ruta activa.

#### Scenario: Card de stats aparece al obtener una ruta
- **GIVEN** no hay ruta activa
- **WHEN** el backend responde con una ruta
- **THEN** el card de stats aparece con animación suave de abajo hacia arriba (duration: 300ms, ease-out)

#### Scenario: Card de stats desaparece al limpiar la ruta
- **GIVEN** hay una ruta activa
- **WHEN** el usuario limpia el formulario o falla una nueva búsqueda
- **THEN** el card desaparece con animación inversa

---

### Requirement: Safety score visual en el card de stats

El card de stats SHALL mostrar el nivel de seguridad como una **barra de progreso horizontal coloreada** (de rojo a verde) con el porcentaje de seguridad y el label textual. No SHALL usar únicamente un badge de texto.

#### Scenario: Barra de progreso muestra nivel de seguridad
- **GIVEN** hay una ruta activa con `safety_label: "moderate"`
- **WHEN** el card de stats se renderiza
- **THEN** aparece una barra horizontal al 50-60% coloreada en amarillo con el label "Riesgo moderado"

---

### Requirement: Header branding compacto

El panel SHALL tener un header de altura fija (`48px`) con el logo/nombre del producto y un botón para cerrar/minimizar el panel sin cerrarlo del todo.

#### Scenario: Usuario minimiza el panel
- **GIVEN** el panel está abierto
- **WHEN** el usuario hace clic en el botón minimizar
- **THEN** el panel colapsa a solo el header (48px) con animación suave, el mapa queda completamente visible
