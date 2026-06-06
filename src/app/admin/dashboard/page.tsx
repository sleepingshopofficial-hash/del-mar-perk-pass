/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BarChart3, Eye, MousePointerClick, FileCheck, XCircle, TrendingUp,
  Cookie, Snowflake, Tag, MapPin, ShoppingBag, Share2, CalendarPlus,
  Globe, Download, RefreshCw, Clock, Activity
} from 'lucide-react';

interface Metrics {
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

function StatCard({ icon: Icon, label, value, color = 'text-orange' }: { icon: any; label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState('');
  const [syncing, setSyncing] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('start_date', startDate);
      if (endDate) params.set('end_date', endDate);
      const res = await fetch(`/api/dashboard/metrics?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMetrics();
  }, [fetchMetrics]);

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      const res = await fetch(`/api/dashboard/export?type=${type}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setExporting('');
    }
  };

  const handleSheetsSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sheets/sync', { method: 'POST' });
      const data = await res.json();
      alert(data.message || `Synced ${data.synced} leads`);
    } catch {
      alert('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const m = metrics || {
    total_scans: 0, landing_views: 0, cta_clicks: 0, cookie_perk_requests: 0,
    cooling_interest: 0, cooling_offer_requests: 0, booth_visitors: 0,
    buyer_registrations: 0, referral_submissions: 0, future_fair_perk_signups: 0,
    spanish_selections: 0, completed_forms: 0, abandoned_paths: 0,
    top_visitor_reason: null, lead_sources: [], qr_location_performance: [],
    partner_performance: 0, coolerpads_clickthroughs: 0,
    daily_activity: [], hourly_activity: [], conversion_rate: 0,
  };

  const maxDaily = Math.max(...m.daily_activity.map(d => d.count), 1);
  const maxHourly = Math.max(...m.hourly_activity.map(h => h.count), 1);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time metrics for Del Mar Fair Perk Pass</p>
        </div>
        <button onClick={fetchMetrics} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Date Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
        <span className="text-gray-400 text-sm font-medium">Date Range:</span>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange outline-none text-sm" />
        <span className="text-gray-500">to</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange outline-none text-sm" />
        {(startDate || endDate) && (
          <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-orange text-sm hover:underline">Clear</button>
        )}
      </div>

      {error && <div className="bg-red-900/50 text-red-300 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {loading && !metrics ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Section 1: Overview Cards */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-orange" /> Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard icon={Eye} label="Total Scans" value={m.total_scans} />
              <StatCard icon={Eye} label="Landing Views" value={m.landing_views} color="text-blue-400" />
              <StatCard icon={MousePointerClick} label="CTA Clicks" value={m.cta_clicks} color="text-green-400" />
              <StatCard icon={FileCheck} label="Completed Forms" value={m.completed_forms} color="text-emerald-400" />
              <StatCard icon={XCircle} label="Abandoned Paths" value={m.abandoned_paths} color="text-red-400" />
              <StatCard icon={TrendingUp} label="Conversion Rate" value={`${m.conversion_rate}%`} color="text-purple-400" />
            </div>
          </section>

          {/* Section 2: Path Performance */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-orange" /> Path Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Cookie} label="Cookie Perk Requests" value={m.cookie_perk_requests} color="text-amber-400" />
              <StatCard icon={Snowflake} label="Cooling Interest" value={m.cooling_interest} color="text-cyan-400" />
              <StatCard icon={Snowflake} label="Cooling Offer Requests" value={m.cooling_offer_requests} color="text-sky-400" />
              <StatCard icon={MapPin} label="Booth Visitors" value={m.booth_visitors} color="text-pink-400" />
              <StatCard icon={ShoppingBag} label="Buyer Registrations" value={m.buyer_registrations} color="text-green-400" />
              <StatCard icon={Share2} label="Referral Submissions" value={m.referral_submissions} color="text-indigo-400" />
              <StatCard icon={CalendarPlus} label="Future Fair Perks" value={m.future_fair_perk_signups} color="text-violet-400" />
              <StatCard icon={Globe} label="Spanish Selections" value={m.spanish_selections} color="text-yellow-400" />
            </div>
          </section>

          {/* Section 3: Sources */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-orange" /> Sources &amp; Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Sources */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h3 className="text-white font-medium mb-3">Lead Sources</h3>
                {m.lead_sources.length === 0 ? (
                  <p className="text-gray-500 text-sm">No lead source data yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-gray-700"><th className="text-left text-gray-400 pb-2">Source</th><th className="text-right text-gray-400 pb-2">Count</th></tr></thead>
                      <tbody>
                        {m.lead_sources.sort((a, b) => b.count - a.count).map(s => (
                          <tr key={s.source} className="border-b border-gray-700/50">
                            <td className="py-2 text-white">{s.source}</td>
                            <td className="py-2 text-right text-gray-300">{s.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* QR Location Performance */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h3 className="text-white font-medium mb-3">QR Location Performance</h3>
                {m.qr_location_performance.length === 0 ? (
                  <p className="text-gray-500 text-sm">No QR location data yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-gray-700"><th className="text-left text-gray-400 pb-2">Location</th><th className="text-right text-gray-400 pb-2">Scans</th></tr></thead>
                      <tbody>
                        {m.qr_location_performance.sort((a, b) => b.count - a.count).map(l => (
                          <tr key={l.location} className="border-b border-gray-700/50">
                            <td className="py-2 text-white">{l.location}</td>
                            <td className="py-2 text-right text-gray-300">{l.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Partner & CoolerPads */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h3 className="text-white font-medium mb-3">Partner &amp; CoolerPads</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Partner Performance (Cookie Perks)</span>
                    <span className="text-white font-semibold">{m.partner_performance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">CoolerPads Clickthroughs</span>
                    <span className="text-white font-semibold">{m.coolerpads_clickthroughs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Top Visitor Reason</span>
                    <span className="text-white font-semibold">{m.top_visitor_reason || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Activity */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-orange" /> Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Activity */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h3 className="text-white font-medium mb-4">Daily Activity</h3>
                {m.daily_activity.length === 0 ? (
                  <p className="text-gray-500 text-sm">No daily activity data yet</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {m.daily_activity.map(d => (
                      <div key={d.date} className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs w-24 shrink-0">{d.date}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden">
                          <div className="bg-orange h-full rounded-full transition-all" style={{ width: `${(d.count / maxDaily) * 100}%` }} />
                        </div>
                        <span className="text-gray-300 text-xs w-8 text-right">{d.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hourly Activity */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h3 className="text-white font-medium mb-4">Hourly Activity</h3>
                {m.hourly_activity.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hourly activity data yet</p>
                ) : (
                  <div className="flex items-end gap-1 h-48">
                    {m.hourly_activity.map(h => (
                      <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-gray-400 text-[10px]">{h.count || ''}</span>
                        <div className="w-full bg-gray-700 rounded-t relative" style={{ height: `${Math.max((h.count / maxHourly) * 100, 2)}%` }}>
                          <div className="absolute inset-0 bg-orange/80 rounded-t" />
                        </div>
                        <span className="text-gray-500 text-[10px]">{h.hour}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 5: Export */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-orange" /> Export &amp; Sync</h2>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleExport('leads')} disabled={!!exporting} className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50">
                  <Download className="w-4 h-4" /> {exporting === 'leads' ? 'Exporting...' : 'Export Leads CSV'}
                </button>
                <button onClick={() => handleExport('buyers')} disabled={!!exporting} className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50">
                  <Download className="w-4 h-4" /> {exporting === 'buyers' ? 'Exporting...' : 'Export Buyers CSV'}
                </button>
                <button onClick={() => handleExport('referrals')} disabled={!!exporting} className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50">
                  <Download className="w-4 h-4" /> {exporting === 'referrals' ? 'Exporting...' : 'Export Referrals CSV'}
                </button>
                <button onClick={handleSheetsSync} disabled={syncing} className="flex items-center gap-2 px-4 py-2.5 bg-orange text-white rounded-lg hover:bg-orange-dark transition text-sm disabled:opacity-50">
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync to Google Sheets'}
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
