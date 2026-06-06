'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface LeadRow {
  id: string;
  first_name: string | null;
  mobile_number: string | null;
  email: string | null;
  selected_path: string | null;
  lead_score: number;
  completed_form: boolean;
  created_at: string;
  lead_tags?: { tag: string }[];
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (query) params.set('q', query);
    const res = await fetch(`/api/dashboard/search?${params}`);
    if (res.ok) { const d = await res.json(); setLeads(d.leads || []); setTotal(d.total || 0); }
    setLoading(false);
  }, [page, query]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <span className="text-gray-400 text-sm">{total} total</span>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Search by name, mobile, or email..."
          className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-orange outline-none" />
      </div>
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Mobile</th><th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Path</th><th className="text-left px-4 py-3">Tags</th><th className="text-left px-4 py-3">Score</th><th className="text-left px-4 py-3">Date</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> :
             leads.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">No leads found</td></tr> :
             leads.map(l => (
              <tr key={l.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 text-gray-200">
                <td className="px-4 py-3">{l.first_name || '-'}</td>
                <td className="px-4 py-3">{l.mobile_number || '-'}</td>
                <td className="px-4 py-3">{l.email || '-'}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-gray-700 text-xs">{l.selected_path || '-'}</span></td>
                <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(l.lead_tags || []).slice(0, 3).map((t, i) => (<span key={i} className="px-1.5 py-0.5 rounded bg-orange/20 text-orange text-xs">{t.tag}</span>))}{(l.lead_tags || []).length > 3 && <span className="text-xs text-gray-400">+{(l.lead_tags || []).length - 3}</span>}</div></td>
                <td className="px-4 py-3"><span className={`font-bold ${l.lead_score >= 70 ? 'text-green-400' : l.lead_score >= 40 ? 'text-yellow-400' : 'text-gray-400'}`}>{l.lead_score}</span></td>
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(l.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-30">Prev</button>
          <span className="px-4 py-2 text-gray-400">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
