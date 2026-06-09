export type SafetyLevel = 'safe' | 'moderate' | 'danger' | 'no_data'

export interface RobberyStats {
  robbery_count: number
  armed_robbery_count: number
  hour_range: string
}

export interface RouteSegment {
  type: 'Feature'
  geometry: {
    type: 'LineString'
    coordinates: [number, number][]
  }
  properties: RobberyStats & {
    safety_score: number
  }
}

export interface RouteSummary {
  total_robbery_count: number
  armed_robbery_count: number
  safety_label: SafetyLevel
  distance_km: number
  estimated_minutes: number
}

export interface RouteResponse {
  type: 'FeatureCollection'
  features: RouteSegment[]
  summary: RouteSummary
}

export interface RouteRequest {
  from: [number, number]
  to: [number, number]
  hour?: number
}
