import { useEffect, useRef } from 'react'
import maplibregl, { type GeoJSONSource } from 'maplibre-gl'
import type { Feature, FeatureCollection } from 'geojson'
import { useMap } from '@/contexts/MapContext'
import { useRouteStore } from '@/store/routeStore'
import { renderRoutePopupHtml } from './popupHtml'
import type { RouteKind, SafeRoute, SafeRoutesResponse } from '@/types/route'

const SOURCE_SOLID = 'routes'
const SOURCE_DASHED = 'routes-dashed'
const LAYER_CASING = 'routes-casing'
const LAYER_GLOW = 'routes-glow'
const LAYER_SOLID = 'routes-line'
const LAYER_DASHED = 'routes-dashed-line'

const CLICKABLE = [LAYER_SOLID, LAYER_DASHED]
const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] }

/** Color de línea por tipo de ruta (contrato §7). */
const KIND_COLOR_EXPR: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'kind'],
  'safest',
  '#00E599',
  'balanced',
  '#F5B82E',
  'fastest',
  '#FF4D4D',
  /* default least_safe_candidate */ '#7B8191',
]

/** Prioridad de apilado: seleccionada arriba, luego safest > balanced > fastest. */
const SORT_PRIORITY: Record<RouteKind, number> = {
  safest: 3,
  balanced: 2,
  fastest: 1,
  least_safe_candidate: 0,
}

function toFeature(route: SafeRoute, selectedKind: RouteKind): Feature {
  const selected = route.kind === selectedKind
  return {
    type: 'Feature',
    geometry: route.geometry,
    properties: {
      kind: route.kind,
      risk_level: route.risk_level,
      selected,
      sort: selected ? 100 : SORT_PRIORITY[route.kind],
    },
  }
}

function buildCollections(
  response: SafeRoutesResponse | null,
  selectedKind: RouteKind,
  hiddenKinds: RouteKind[],
): { solid: FeatureCollection; dashed: FeatureCollection } {
  if (!response) return { solid: EMPTY, dashed: EMPTY }
  const visible = response.routes.filter((r) => !hiddenKinds.includes(r.kind))
  return {
    solid: {
      type: 'FeatureCollection',
      features: visible
        .filter((r) => r.kind !== 'least_safe_candidate')
        .map((r) => toFeature(r, selectedKind)),
    },
    dashed: {
      type: 'FeatureCollection',
      features: visible
        .filter((r) => r.kind === 'least_safe_candidate')
        .map((r) => toFeature(r, selectedKind)),
    },
  }
}

export default function RouteLayer() {
  const map = useMap()
  const { response, selectedKind, hiddenKinds } = useRouteStore()
  const popupRef = useRef<maplibregl.Popup | null>(null)

  // Setup de fuentes y capas (una sola vez)
  useEffect(() => {
    if (!map || map.getSource(SOURCE_SOLID)) return

    map.addSource(SOURCE_DASHED, { type: 'geojson', data: EMPTY })
    map.addSource(SOURCE_SOLID, { type: 'geojson', data: EMPTY })

    // Candidato de mayor exposición — punteado, baja opacidad (contraste)
    map.addLayer({
      id: LAYER_DASHED,
      type: 'line',
      source: SOURCE_DASHED,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#7B8191',
        'line-width': 3,
        'line-opacity': 0.5,
        'line-dasharray': [2, 2],
      },
    })

    // Casing oscuro
    map.addLayer({
      id: LAYER_CASING,
      type: 'line',
      source: SOURCE_SOLID,
      layout: { 'line-join': 'round', 'line-cap': 'round', 'line-sort-key': ['get', 'sort'] },
      paint: {
        'line-color': '#000000',
        'line-width': ['case', ['get', 'selected'], 12, 8],
        'line-opacity': 0.3,
      },
    })

    // Glow solo para la ruta seleccionada
    map.addLayer({
      id: LAYER_GLOW,
      type: 'line',
      source: SOURCE_SOLID,
      filter: ['==', ['get', 'selected'], true],
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': KIND_COLOR_EXPR,
        'line-width': 14,
        'line-opacity': 0.35,
        'line-blur': 8,
      },
    })

    // Línea principal
    map.addLayer({
      id: LAYER_SOLID,
      type: 'line',
      source: SOURCE_SOLID,
      layout: { 'line-join': 'round', 'line-cap': 'round', 'line-sort-key': ['get', 'sort'] },
      paint: {
        'line-color': KIND_COLOR_EXPR,
        'line-width': ['case', ['get', 'selected'], 6.5, 4],
        'line-opacity': ['case', ['get', 'selected'], 1, 0.72],
      },
    })

    const openPopup = (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      const kind = feature?.properties?.kind as RouteKind | undefined
      if (!kind) return

      const store = useRouteStore.getState()
      const route = store.routeByKind(kind)
      if (!route) return

      store.setSelectedKind(kind)
      store.setPopupKind(kind)
      popupRef.current?.remove()

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'route-popup',
        maxWidth: '320px',
        offset: 12,
      })
        .setLngLat(e.lngLat)
        .setHTML(renderRoutePopupHtml(route))
        .addTo(map)

      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') popup.remove()
      }
      window.addEventListener('keydown', onKeyDown)

      popup.on('close', () => {
        window.removeEventListener('keydown', onKeyDown)
        if (popupRef.current === popup) {
          popupRef.current = null
          useRouteStore.getState().setPopupKind(null)
        }
      })

      popupRef.current = popup
    }

    CLICKABLE.forEach((layer) => {
      map.on('click', layer, openPopup)
      map.on('mouseenter', layer, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', layer, () => {
        map.getCanvas().style.cursor = ''
      })
    })

    // Clic fuera de cualquier ruta → cerrar popup
    map.on('click', (e) => {
      if (!popupRef.current) return
      const hits = map.queryRenderedFeatures(e.point, { layers: CLICKABLE })
      if (!hits.length) popupRef.current.remove()
    })
  }, [map])

  // Datos: recomputa al cambiar respuesta / selección / visibilidad
  useEffect(() => {
    const solidSrc = map?.getSource(SOURCE_SOLID) as GeoJSONSource | undefined
    const dashedSrc = map?.getSource(SOURCE_DASHED) as GeoJSONSource | undefined
    if (!solidSrc || !dashedSrc) return
    const { solid, dashed } = buildCollections(response, selectedKind, hiddenKinds)
    solidSrc.setData(solid)
    dashedSrc.setData(dashed)
  }, [map, response, selectedKind, hiddenKinds])

  // Encuadre a la ruta seleccionada
  useEffect(() => {
    if (!map || !response) return
    const route =
      response.routes.find((r) => r.kind === selectedKind) ?? response.routes[0]
    const coords = route?.geometry.coordinates
    if (!coords?.length) return
    const bounds = coords.reduce(
      (b, c) => b.extend(c as [number, number]),
      new maplibregl.LngLatBounds(coords[0], coords[0]),
    )
    map.fitBounds(bounds, {
      padding: { top: 90, bottom: 220, left: 70, right: 70 },
      duration: 800,
    })
  }, [map, response, selectedKind])

  // Cerrar popup si cambia la respuesta
  useEffect(() => {
    popupRef.current?.remove()
  }, [response])

  useEffect(
    () => () => {
      popupRef.current?.remove()
    },
    [],
  )

  return null
}
