/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminSupabaseClient();
  const url = new URL(request.url);
  const start = url.searchParams.get('start_date');
  const end = url.searchParams.get('end_date');

  // Helper for date-filtered queries
  const dateFilter = (q: any) => {
    if (start) q = q.gte('created_at', start);
    if (end) q = q.lte('created_at', end + 'T23:59:59');
    return q;
  };

  // All metrics from REAL data
  const [scans, ctaClicks, leads, tags, buyers, referrals, sessions, cpClicks] = await Promise.all([
    dateFilter(admin.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'landing_view')),
    dateFilter(admin.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'cta_click')),
    dateFilter(admin.from('leads').select('*')),
    admin.from('lead_tags').select('*'),
    dateFilter(admin.from('buyers').select('id', { count: 'exact', head: true })),
    dateFilter(admin.from('referrals').select('id', { count: 'exact', head: true })),
    dateFilter(admin.from('sessions').select('*')),
    dateFilter(admin.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'coolerpads_click')),
  ]);

  const allLeads: any[] = leads.data || [];
  const allTags: any[] = tags.data || [];
  const allSessions: any[] = sessions.data || [];

  const countTag = (tag: string) => new Set(allTags.filter((t: any) => t.tag === tag).map((t: any) => t.lead_id)).size;

  // Top visitor reason
  const pathCounts: Record<string, number> = {};
  allSessions.forEach((s: any) => { if (s.first_click_path) pathCounts[s.first_click_path] = (pathCounts[s.first_click_path] || 0) + 1; });
  const topReason = Object.entries(pathCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Lead sources
  const srcCounts: Record<string, number> = {};
  allSessions.forEach((s: any) => { if (s.qr_source) srcCounts[s.qr_source] = (srcCounts[s.qr_source] || 0) + 1; });
  const lead_sources = Object.entries(srcCounts).map(([source, count]) => ({ source, count }));

  // QR location performance
  const locCounts: Record<string, number> = {};
  allSessions.forEach((s: any) => { if (s.qr_location) locCounts[s.qr_location] = (locCounts[s.qr_location] || 0) + 1; });
  const qr_location_performance = Object.entries(locCounts).map(([location, count]) => ({ location, count }));

  // Daily activity (last 30 days)
  const daily: Record<string, number> = {};
  allSessions.forEach((s: any) => { const d = s.created_at?.substring(0, 10); if (d) daily[d] = (daily[d] || 0) + 1; });
  const daily_activity = Object.entries(daily).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));

  // Hourly activity
  const hourly: Record<number, number> = {};
  allSessions.forEach((s: any) => { const h = new Date(s.created_at).getHours(); hourly[h] = (hourly[h] || 0) + 1; });
  const hourly_activity = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: hourly[i] || 0 }));

  const totalSessions = allSessions.length;
  const completedSessions = allSessions.filter((s: any) => s.completed).length;

  return NextResponse.json({
    total_scans: scans.count || 0,
    landing_views: scans.count || 0,
    cta_clicks: ctaClicks.count || 0,
    cookie_perk_requests: countTag('COOKIE_PERK'),
    cooling_interest: countTag('COOLING_INTEREST'),
    cooling_offer_requests: countTag('COOLING_OFFER'),
    booth_visitors: countTag('AT_BOOTH_NOW'),
    buyer_registrations: buyers.count || 0,
    referral_submissions: referrals.count || 0,
    future_fair_perk_signups: countTag('FUTURE_FAIR_PERKS'),
    spanish_selections: allLeads.filter(l => l.language === 'es').length,
    completed_forms: allLeads.filter(l => l.completed_form).length,
    abandoned_paths: allSessions.filter(s => !s.completed).length,
    top_visitor_reason: topReason,
    lead_sources,
    qr_location_performance,
    partner_performance: countTag('COOKIE_PERK'),
    coolerpads_clickthroughs: cpClicks.count || 0,
    daily_activity,
    hourly_activity,
    conversion_rate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
  });
}
