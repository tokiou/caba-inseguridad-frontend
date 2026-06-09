import { useEffect } from 'react'
import maplibregl, { type GeoJSONSource } from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import { useMap } from '@/contexts/MapContext'
import { useRouteStore } from '@/store/routeStore'
import type { RouteSegment } from '@/types/route'

const SOURCE = 'route'
const LAYER_CASING = 'route-casing'
const LAYER_LINE = 'route-line'

export default function RouteLayer() {
  const map = useMap()
  const { activeRoute, setSelectedSegment } = useRouteStore()

  useEffect(() => {
    if (!map) return

    const data: FeatureCollection = activeRoute ?? {
      type: 'FeatureCollection',
      features: [],
    }

    if (map.getSource(SOURCE)) {
      ;(map.getSource(SOURCE) as GeoJSONSource).setData(data)
      return
    }

    map.addSource(SOURCE, { type: 'geojson', data })

    map.addLayer({
      id: LAYER_CASING,
      type: 'line',
      source: SOURCE,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#000000', 'line-width': 10, 'line-opacity': 0.25 },
    })

    map.addLayer({
      id: LAYER_LINE,
      type: 'line',
      source: SOURCE,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': [
          'interpolate',
          ['linear'],
          ['get', 'safety_score'],
          0, '#ef4444',
          0.4, '#f59e0b',
          0.7, '#22c55e',
        ],
        'line-width': 6,
        'line-opacity': 0.95,
      },
    })

    map.on('click', LAYER_LINE, (e) => {
      const feature = e.features?.[0]
      if (feature) setSelectedSegment(feature as unknown as RouteSegment)
    })

    map.on('mouseenter', LAYER_LINE, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', LAYER_LINE, () => {
      map.getCanvas().style.cursor = ''
    })
  }, [map])

  useEffect(() => {
    if (!map) return
    const source = map.getSource(SOURCE) as GeoJSONSource | undefined
    if (!source) return
    source.setData(
      activeRoute ?? { type: 'FeatureCollection', features: [] },
    )
  }, [map, activeRoute])

  useEffect(() => {
    if (!map || !activeRoute?.features.length) return
    const coords = activeRoute.features.flatMap(
      (f) => f.geometry.coordinates,
    ) as [number, number][]
    if (!coords.length) return
    const bounds = coords.reduce(
      (b, c) => b.extend(c as [number, number]),
      new maplibregl.LngLatBounds(coords[0], coords[0]),
    )
    map.fitBounds(bounds, { padding: { top: 80, bottom: 80, left: 60, right: 60 }, duration: 1000 })
  }, [map, activeRoute])

  return null
}
