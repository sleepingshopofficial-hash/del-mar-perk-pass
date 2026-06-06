'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface BuyerRow {
  id: string;
  purchase_date: string | null;
  units_purchased: string | null;
  pickup_status: string | null;
  salesperson: string | null;
  created_at: string;
  leads: { first_name: string | null; mobile_number: string | null; email: string | null } | null;
}

export default function AdminBuyers() {
  const [buyers, setBuyers] = useState<BuyerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.from('buyers').select('*, leads(first_name, mobile_number, email)').order('created_at', { ascending: false })
      .then(({ data }) => { setBuyers((data as BuyerRow[]) || []); setLoading(false); });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Buyers</h1>
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Mobile</th><th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Purchase Date</th><th className="text-left px-4 py-3">Units</th><th className="text-left px-4 py-3">Pickup</th>
            <th className="text-left px-4 py-3">Salesperson</th><th className="text-left px-4 py-3">Date</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr> :
             buyers.length === 0 ? <tr><td colSpan={8} className="text-center py-8 text-gray-400">No buyers registered yet</td></tr> :
             buyers.map(b => (
              <tr key={b.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 text-gray-200">
                <td className="px-4 py-3">{b.leads?.first_name || '-'}</td>
                <td className="px-4 py-3">{b.leads?.mobile_number || '-'}</td>
                <td className="px-4 py-3">{b.leads?.email || '-'}</td>
                <td className="px-4 py-3">{b.purchase_date || '-'}</td>
                <td className="px-4 py-3">{b.units_purchased || '-'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${b.pickup_status === 'Took it today' ? 'bg-green-900/50 text-green-300' : b.pickup_status === 'Need follow-up' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>{b.pickup_status || '-'}</span></td>
                <td className="px-4 py-3">{b.salesperson || '-'}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
