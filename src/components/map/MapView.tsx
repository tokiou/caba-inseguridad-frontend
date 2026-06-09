import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { MapContext } from '@/contexts/MapContext'
import RouteLayer from './RouteLayer'
import MarkersLayer from './MarkersLayer'
import SafetyLegend from './SafetyLegend'
import { useMapStore } from '@/store/mapStore'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<maplibregl.Map | null>(null)
  const { center, zoom } = useMapStore()

  useEffect(() => {
    if (!containerRef.current) return

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [center.lng, center.lat],
      zoom,
      attributionControl: false,
    })

    instance.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-right',
    )
    instance.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right',
    )

    instance.on('load', () => setMap(instance))

    return () => {
      instance.remove()
      setMap(null)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {map && (
        <MapContext.Provider value={map}>
          <RouteLayer />
          <MarkersLayer />
          <SafetyLegend />
        </MapContext.Provider>
      )}
    </div>
  )
}
