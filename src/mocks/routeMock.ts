import type {
  CrimeMetrics,
  RiskLevel,
  RiskiestSegment,
  SafeRoute,
  SafeRoutesResponse,
  TimeBucket,
  TimeOfDayRisk,
} from '@/types/route'

/**
 * Mock con el shape del contrato real (SafeRoutesResponse) para desarrollar sin
 * backend. Demo Palermo (Plaza Italia) → San Telmo, contexto nocturno día de
 * semana. Valores inspirados en la tabla del ejemplo §9 del contrato.
 */

const ORIGIN = { lat: -34.5806, lng: -58.4209 }
const DESTINATION = { lat: -34.6203, lng: -58.3717 }

/** Trazado directo diagonal (fastest / least_safe_candidate). */
const FASTEST_COORDS: [number, number][] = [
  [-58.4209, -34.5806],
  [-58.4156, -34.5849],
  [-58.4089, -34.5908],
  [-58.4015, -34.5972],
  [-58.3941, -34.6036],
  [-58.3872, -34.6092],
  [-58.3804, -34.6141],
  [-58.3741, -34.6178],
  [-58.3717, -34.6203],
]

/** Trazado sinuoso por avenidas (balanced). */
const BALANCED_COORDS: [number, number][] = [
  [-58.4209, -34.5806],
  [-58.4189, -34.5813],
  [-58.417, -34.5821],
  [-58.415, -34.5828],
  [-58.4131, -34.5836],
  [-58.4111, -34.5843],
  [-58.4092, -34.585],
  [-58.4072, -34.5858],
  [-58.4053, -34.5865],
  [-58.4033, -34.5872],
  [-58.4014, -34.588],
  [-58.3994, -34.5887],
  [-58.3975, -34.5895],
  [-58.3955, -34.5902],
  [-58.3936, -34.5909],
  [-58.3916, -34.5917],
  [-58.3897, -34.5924],
  [-58.3877, -34.5932],
  [-58.3857, -34.5939],
  [-58.3838, -34.5946],
  [-58.3818, -34.5954],
  [-58.3817, -34.5971],
  [-58.3816, -34.5988],
  [-58.3816, -34.6004],
  [-58.3815, -34.6021],
  [-58.3816, -34.6037],
  [-58.3818, -34.6054],
  [-58.3819, -34.6071],
  [-58.382, -34.6089],
  [-58.3801, -34.6088],
  [-58.3782, -34.6087],
  [-58.3763, -34.6087],
  [-58.3744, -34.6086],
  [-58.3741, -34.6099],
  [-58.3738, -34.6112],
  [-58.3735, -34.6125],
  [-58.3731, -34.6141],
  [-58.3727, -34.6156],
  [-58.3723, -34.6172],
  [-58.372, -34.6187],
  [-58.3717, -34.6203],
]

/** Safest: igual base que balanced pero con un desvío visible hacia el oeste. */
const SAFEST_COORDS: [number, number][] = BALANCED_COORDS.map(([lng, lat], i) => {
  const inner = i > 8 && i < 32
  return inner ? [lng - 0.0014, lat] : [lng, lat]
})

const crime = (m: Partial<CrimeMetrics>): CrimeMetrics => ({
  crime_count: 0,
  robbery_count: 0,
  theft_count: 0,
  threats_count: 0,
  armed_count: 0,
  motorcycle_count: 0,
  same_bucket_crime_count: 0,
  ...m,
})

const levelOf = (s: number): RiskLevel => (s >= 0.66 ? 'high' : s >= 0.4 ? 'moderate' : 'low')

const tod = (m: number, a: number, e: number, n: number, peak: TimeBucket): TimeOfDayRisk => ({
  morning: { risk_score: m, risk_level: levelOf(m) },
  afternoon: { risk_score: a, risk_level: levelOf(a) },
  evening: { risk_score: e, risk_level: levelOf(e) },
  night: { risk_score: n, risk_level: levelOf(n) },
  peak_bucket: peak,
})

const riskiest = (
  lng: number,
  lat: number,
  score: number,
  m: Partial<RiskiestSegment>,
): RiskiestSegment => ({
  risk_score: score,
  risk_level: levelOf(score),
  length_meters: 58,
  point: { lat, lng },
  crime_count: 0,
  robbery_count: 0,
  armed_count: 0,
  theft_count: 0,
  threats_count: 0,
  motorcycle_count: 0,
  ...m,
})

const ROUTES: SafeRoute[] = [
  {
    kind: 'fastest',
    distance_meters: 4998,
    duration_minutes: 59.5,
    risk_score: 0.939,
    risk_level: 'high',
    extra_distance_vs_fastest_meters: 0,
    extra_duration_vs_fastest_minutes: 0,
    risk_reduction_vs_fastest_percent: 0,
    high_risk_edge_meters: 2890.5,
    high_risk_edge_percent: 57.8,
    max_edge_risk: 1,
    avg_edge_risk: 0.71,
    crime_metrics: crime({
      crime_count: 612430,
      robbery_count: 248110,
      theft_count: 251002,
      threats_count: 22140,
      armed_count: 31980,
      motorcycle_count: 26410,
      same_bucket_crime_count: 119870,
    }),
    dominant_factor: 'theft',
    armed_share_percent: 5.2,
    riskiest_segment: riskiest(-58.4089, -34.5908, 1, {
      crime_count: 4202,
      robbery_count: 1787,
      armed_count: 198,
      theft_count: 1765,
      threats_count: 114,
      motorcycle_count: 154,
    }),
    time_of_day_risk: tod(0.82, 0.79, 0.9, 0.94, 'night'),
    geometry: { type: 'LineString', coordinates: FASTEST_COORDS },
  },
  {
    kind: 'balanced',
    distance_meters: 5901,
    duration_minutes: 70.2,
    risk_score: 0.47,
    risk_level: 'moderate',
    extra_distance_vs_fastest_meters: 903,
    extra_duration_vs_fastest_minutes: 10.7,
    risk_reduction_vs_fastest_percent: 49.9,
    high_risk_edge_meters: 581.4,
    high_risk_edge_percent: 9.9,
    max_edge_risk: 0.82,
    avg_edge_risk: 0.293,
    crime_metrics: crime({
      crime_count: 375221,
      robbery_count: 147932,
      theft_count: 155518,
      threats_count: 13263,
      armed_count: 17942,
      motorcycle_count: 15465,
      same_bucket_crime_count: 74198,
    }),
    dominant_factor: 'theft',
    armed_share_percent: 4.8,
    riskiest_segment: riskiest(-58.3818, -34.5954, 0.82, {
      crime_count: 1980,
      robbery_count: 842,
      armed_count: 71,
      theft_count: 905,
      threats_count: 58,
      motorcycle_count: 104,
    }),
    segments: [
      { risk_score: 0.31, robbery_count: 120, length_meters: 142, point: { lat: -34.581, lng: -58.418 } },
      { risk_score: 0.55, robbery_count: 410, length_meters: 138, point: { lat: -34.589, lng: -58.397 } },
      { risk_score: 0.82, robbery_count: 842, length_meters: 58, point: { lat: -34.5954, lng: -58.3818 } },
      { risk_score: 0.34, robbery_count: 150, length_meters: 160, point: { lat: -34.612, lng: -58.374 } },
    ],
    time_of_day_risk: tod(0.38, 0.33, 0.44, 0.52, 'night'),
    geometry: { type: 'LineString', coordinates: BALANCED_COORDS },
  },
  {
    kind: 'safest',
    distance_meters: 5968,
    duration_minutes: 71.1,
    risk_score: 0.464,
    risk_level: 'moderate',
    extra_distance_vs_fastest_meters: 970,
    extra_duration_vs_fastest_minutes: 11.6,
    risk_reduction_vs_fastest_percent: 50.6,
    high_risk_edge_meters: 498.2,
    high_risk_edge_percent: 8.3,
    max_edge_risk: 0.76,
    avg_edge_risk: 0.281,
    crime_metrics: crime({
      crime_count: 361004,
      robbery_count: 141220,
      theft_count: 150330,
      threats_count: 12880,
      armed_count: 16910,
      motorcycle_count: 14720,
      same_bucket_crime_count: 71040,
    }),
    dominant_factor: 'theft',
    armed_share_percent: 4.7,
    riskiest_segment: riskiest(-58.3832, -34.5954, 0.76, {
      crime_count: 1740,
      robbery_count: 731,
      armed_count: 60,
      theft_count: 812,
      threats_count: 51,
      motorcycle_count: 86,
    }),
    time_of_day_risk: tod(0.37, 0.32, 0.43, 0.51, 'night'),
    geometry: { type: 'LineString', coordinates: SAFEST_COORDS },
  },
  {
    kind: 'least_safe_candidate',
    distance_meters: 4998,
    duration_minutes: 59.5,
    risk_score: 0.939,
    risk_level: 'high',
    extra_distance_vs_fastest_meters: 0,
    extra_duration_vs_fastest_minutes: 0,
    risk_reduction_vs_fastest_percent: 0,
    high_risk_edge_meters: 2890.5,
    high_risk_edge_percent: 57.8,
    max_edge_risk: 1,
    avg_edge_risk: 0.71,
    crime_metrics: crime({
      crime_count: 612430,
      robbery_count: 248110,
      theft_count: 251002,
      threats_count: 22140,
      armed_count: 31980,
      motorcycle_count: 26410,
      same_bucket_crime_count: 119870,
    }),
    dominant_factor: 'theft',
    armed_share_percent: 5.2,
    riskiest_segment: riskiest(-58.4089, -34.5908, 1, {
      crime_count: 4202,
      robbery_count: 1787,
      armed_count: 198,
      theft_count: 1765,
      threats_count: 114,
      motorcycle_count: 154,
    }),
    time_of_day_risk: tod(0.82, 0.79, 0.9, 0.94, 'night'),
    geometry: { type: 'LineString', coordinates: FASTEST_COORDS },
  },
]

export const MOCK_SAFE_ROUTES: SafeRoutesResponse = {
  origin: ORIGIN,
  destination: DESTINATION,
  datetime: '2026-06-12T23:00:00-03:00',
  time_bucket: 'night',
  weekday_type: 'weekday',
  model_version: {
    id: 2,
    name: 'network_temporal_edge_risk_v1',
    type: 'deterministic_network_kde',
    train_until: '2025-12-31',
  },
  routes: ROUTES,
}
