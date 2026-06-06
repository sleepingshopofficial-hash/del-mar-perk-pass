'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface ReferralRow {
  id: string;
  referrer_name: string;
  referrer_mobile: string;
  friend_name: string;
  friend_contact: string;
  friend_offer: string | null;
  created_at: string;
}

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.from('referrals').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setReferrals((data as ReferralRow[]) || []); setLoading(false); });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Referrals</h1>
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left px-4 py-3">Referrer</th><th className="text-left px-4 py-3">Referrer Mobile</th>
            <th className="text-left px-4 py-3">Friend</th><th className="text-left px-4 py-3">Friend Contact</th>
            <th className="text-left px-4 py-3">Offer Type</th><th className="text-left px-4 py-3">Date</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr> :
             referrals.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">No referrals yet</td></tr> :
             referrals.map(r => (
              <tr key={r.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 text-gray-200">
                <td className="px-4 py-3">{r.referrer_name}</td>
                <td className="px-4 py-3">{r.referrer_mobile}</td>
                <td className="px-4 py-3">{r.friend_name}</td>
                <td className="px-4 py-3">{r.friend_contact}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-pink-900/30 text-pink-300 text-xs">{r.friend_offer || '-'}</span></td>
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
