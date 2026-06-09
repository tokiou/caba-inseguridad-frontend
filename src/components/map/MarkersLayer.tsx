import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { useMap } from '@/contexts/MapContext'
import { useRouteStore } from '@/store/routeStore'

function createPinElement(color: string, letter: string): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText = `
    width: 32px; height: 32px;
    background: ${color};
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
  `
  const label = document.createElement('span')
  label.textContent = letter
  label.style.cssText = `
    color: white; font-weight: 700; font-size: 13px;
    transform: rotate(45deg); display: block;
  `
  el.appendChild(label)
  return el
}

export default function MarkersLayer() {
  const map = useMap()
  const { origin, destination } = useRouteStore()
  const originMarker = useRef<maplibregl.Marker | null>(null)
  const destMarker = useRef<maplibregl.Marker | null>(null)

  useEffect(() => {
    if (!map) return
    originMarker.current?.remove()
    if (origin) {
      originMarker.current = new maplibregl.Marker({
        element: createPinElement('#22c55e', 'A'),
        anchor: 'bottom',
      })
        .setLngLat([origin.lng, origin.lat])
        .addTo(map)
    }
    return () => { originMarker.current?.remove() }
  }, [map, origin])

  useEffect(() => {
    if (!map) return
    destMarker.current?.remove()
    if (destination) {
      destMarker.current = new maplibregl.Marker({
        element: createPinElement('#ef4444', 'B'),
        anchor: 'bottom',
      })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map)
    }
    return () => { destMarker.current?.remove() }
  }, [map, destination])

  return null
}
