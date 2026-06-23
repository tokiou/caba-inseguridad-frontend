import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { useMap } from '@/contexts/MapContext'
import { useRouteStore } from '@/store/routeStore'
import { useUIStore } from '@/store/uiStore'

/** Pin circular tipo ubicación (punta hacia abajo) con etiqueta al costado. */
function createPinElement(color: string, label: string): HTMLElement {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'position:relative;width:26px;height:26px;'

  const pin = document.createElement('div')
  pin.style.cssText = `
    position:absolute;inset:0;background:${color};
    border:3px solid #0F1117;border-radius:50% 50% 50% 0;
    transform:rotate(45deg);
    box-shadow:0 3px 10px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.15),0 0 14px ${color}88;
  `
  const dot = document.createElement('span')
  dot.style.cssText =
    'position:absolute;inset:0;margin:auto;width:8px;height:8px;border-radius:50%;background:#0F1117;transform:rotate(-45deg);'
  pin.appendChild(dot)
  wrap.appendChild(pin)

  if (label) {
    const tag = document.createElement('span')
    tag.textContent = label
    tag.style.cssText = `
      position:absolute;left:calc(100% + 7px);top:0;
      max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
      padding:3px 9px;border-radius:9999px;font-size:11px;font-weight:600;
      color:#F5F7FA;background:rgba(15,17,23,0.85);
      border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(8px);
      box-shadow:0 4px 14px rgba(0,0,0,0.4);
    `
    wrap.appendChild(tag)
  }
  return wrap
}

/** Marcador de alerta para la cuadra de mayor exposición (no es un pin de extremo). */
function createRiskiestElement(): HTMLElement {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'position:relative;width:22px;height:22px;'
  wrap.innerHTML = `
    <span style="position:absolute;inset:-6px;border-radius:50%;background:rgba(255,77,77,0.22);"></span>
    <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      border-radius:50%;background:#FF4D4D;border:2px solid #0F1117;
      box-shadow:0 0 12px rgba(255,77,77,0.7);">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F1117"
        stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 9v4"/><path d="M12 17h.01"/>
      </svg>
    </span>`
  return wrap
}

function shortLabel(name: string) {
  return name.split(',').slice(0, 2).join(',').trim()
}

export default function MarkersLayer() {
  const map = useMap()
  const { origin, destination, response, selectedKind, focusPoint, setFocusPoint } = useRouteStore()
  const showRiskZones = useUIStore((s) => s.layers.risk_zones)
  const originMarker = useRef<maplibregl.Marker | null>(null)
  const destMarker = useRef<maplibregl.Marker | null>(null)
  const riskiestMarker = useRef<maplibregl.Marker | null>(null)

  // Pines de origen y destino
  useEffect(() => {
    if (!map) return

    const originCoords: [number, number] | null = response
      ? [response.origin.lng, response.origin.lat]
      : origin
        ? [origin.lng, origin.lat]
        : null
    const destCoords: [number, number] | null = response
      ? [response.destination.lng, response.destination.lat]
      : destination
        ? [destination.lng, destination.lat]
        : null

    const originLabel = origin ? shortLabel(origin.label) : 'Origen'
    const destLabel = destination ? shortLabel(destination.label) : 'Destino'

    originMarker.current?.remove()
    destMarker.current?.remove()
    originMarker.current = null
    destMarker.current = null

    if (originCoords) {
      originMarker.current = new maplibregl.Marker({
        element: createPinElement('#F5F7FA', originLabel),
        anchor: 'bottom',
      })
        .setLngLat(originCoords)
        .addTo(map)
    }
    if (destCoords) {
      destMarker.current = new maplibregl.Marker({
        element: createPinElement('#9AA3B2', destLabel),
        anchor: 'bottom',
      })
        .setLngLat(destCoords)
        .addTo(map)
    }

    return () => {
      originMarker.current?.remove()
      destMarker.current?.remove()
    }
  }, [map, origin, destination, response])

  // Marcador de la cuadra de mayor exposición de la ruta seleccionada
  useEffect(() => {
    if (!map) return
    riskiestMarker.current?.remove()
    riskiestMarker.current = null

    if (!showRiskZones) return
    const route = response?.routes.find((r) => r.kind === selectedKind)
    const point = route?.riskiest_segment?.point
    if (!point) return

    riskiestMarker.current = new maplibregl.Marker({
      element: createRiskiestElement(),
      anchor: 'center',
    })
      .setLngLat([point.lng, point.lat])
      .addTo(map)

    return () => {
      riskiestMarker.current?.remove()
    }
  }, [map, response, selectedKind, showRiskZones])

  // "Ver en el mapa": flyTo al punto y consumirlo
  useEffect(() => {
    if (!map || !focusPoint) return
    map.flyTo({ center: [focusPoint.lng, focusPoint.lat], zoom: 16, duration: 900 })
    setFocusPoint(null)
  }, [map, focusPoint, setFocusPoint])

  return null
}
