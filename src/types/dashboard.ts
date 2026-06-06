export interface DashboardMetrics {
  total_scans: number;
  landing_views: number;
  cta_clicks: number;
  cookie_perk_requests: number;
  cooling_interest: number;
  cooling_offer_requests: number;
  booth_visitors: number;
  buyer_registrations: number;
  referral_submissions: number;
  future_fair_perk_signups: number;
  spanish_selections: number;
  completed_forms: number;
  abandoned_paths: number;
  top_visitor_reason: string | null;
  lead_sources: { source: string; count: number }[];
  qr_location_performance: { location: string; count: number }[];
  partner_performance: number;
  coolerpads_clickthroughs: number;
  daily_activity: { date: string; count: number }[];
  hourly_activity: { hour: number; count: number }[];
  conversion_rate: number;
}
