// Tipos del contrato real del backend de rutas seguras
// (GET /api/v1/routes/safe). Ver openspec/changes/safe-routes-integration.

export type RouteKind = 'fastest' | 'balanced' | 'safest' | 'least_safe_candidate'
export type RiskLevel = 'low' | 'moderate' | 'high'
export type TimeBucket = 'morning' | 'afternoon' | 'evening' | 'night'
export type WeekdayType = 'weekday' | 'weekend'
export type DominantFactor = 'robbery' | 'theft' | 'threats' | 'none'

export interface LatLng {
  lat: number
  lng: number
}

export interface ModelVersionInfo {
  id: number
  name: string
  type: string
  train_until: string // YYYY-MM-DD
}

/**
 * Sumas de EXPOSICIÓN por tramo, NO conteos de incidentes distintos: un mismo
 * delito influye varios tramos consecutivos y cuenta en cada uno. Nunca mostrar
 * como "X delitos en esta ruta" — solo intensidad/exposición relativa.
 */
export interface CrimeMetrics {
  crime_count: number
  robbery_count: number
  theft_count: number
  threats_count: number
  armed_count: number
  motorcycle_count: number
  same_bucket_crime_count: number
}

/** GeoJSON LineString — coordinates en orden [lng, lat]. */
export interface GeoJSONLineString {
  type: 'LineString'
  coordinates: [number, number][]
}

/** Cuadra de mayor riesgo de una ruta (coincide con max_edge_risk). */
export interface RiskiestSegment {
  risk_score: number
  risk_level: RiskLevel
  length_meters: number
  point: LatLng // mediopunto del tramo
  crime_count: number
  robbery_count: number
  armed_count: number
  theft_count: number
  threats_count: number
  motorcycle_count: number
}

/** Vista mínima por cuadra, en orden de recorrido. */
export interface RouteSegment {
  risk_score: number
  robbery_count: number
  length_meters: number
  point: LatLng
}

export interface BucketRisk {
  risk_score: number
  risk_level: RiskLevel
}

/** Riesgo de la misma ruta por franja horaria (weekday_type resuelto). */
export interface TimeOfDayRisk {
  morning: BucketRisk
  afternoon: BucketRisk
  evening: BucketRisk
  night: BucketRisk
  peak_bucket: TimeBucket
}

export interface SafeRoute {
  kind: RouteKind
  distance_meters: number
  duration_minutes: number
  risk_score: number // 0..1 (mayor = más peligroso)
  risk_level: RiskLevel
  extra_distance_vs_fastest_meters: number
  extra_duration_vs_fastest_minutes: number
  risk_reduction_vs_fastest_percent: number
  high_risk_edge_meters: number
  high_risk_edge_percent: number
  max_edge_risk: number // 0..1
  avg_edge_risk: number // 0..1
  crime_metrics: CrimeMetrics

  // Metadata explicativa (el FE compone la prosa; son métricas, no texto)
  riskiest_segment?: RiskiestSegment // omitido si la ruta no tiene tramos
  segments?: RouteSegment[]
  dominant_factor: DominantFactor
  armed_share_percent: number
  time_of_day_risk?: TimeOfDayRisk // omitido si la ruta no tiene tramos

  geometry: GeoJSONLineString
}

export interface SafeRoutesResponse {
  origin: LatLng
  destination: LatLng
  datetime: string // RFC3339
  time_bucket: TimeBucket
  weekday_type: WeekdayType
  model_version: ModelVersionInfo
  routes: SafeRoute[] // 1..4; buscar por `kind`, no por índice
}

export interface ApiError {
  error: string // código máquina
  message: string
}
