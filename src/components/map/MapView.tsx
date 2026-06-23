import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { MapContext } from '@/contexts/MapContext'
import RouteLayer from './RouteLayer'
import MarkersLayer from './MarkersLayer'
import { useMapStore } from '@/store/mapStore'
import { useUIStore } from '@/store/uiStore'

const MAP_STYLES = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<maplibregl.Map | null>(null)
  const { center, zoom } = useMapStore()
  const basemap = useUIStore((s) => s.basemap)

  useEffect(() => {
    if (!containerRef.current) return

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLES[basemap],
      center: [center.lng, center.lat],
      zoom,
      attributionControl: false,
    })

    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    instance.addControl(
      new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
      'bottom-right',
    )
    instance.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

    instance.on('load', () => setMap(instance))

    return () => {
      instance.remove()
      setMap(null)
    }
    // basemap se maneja remontando MapView (key) desde App, así que no va en deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {map && (
        <MapContext.Provider value={map}>
          <RouteLayer />
          <MarkersLayer />
        </MapContext.Provider>
      )}
    </div>
  )
}
