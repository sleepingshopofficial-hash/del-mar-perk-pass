'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const OFFERS = ['Cookie perk', 'Cooling offer', 'Both', 'Not sure'];

function ReferralContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const [form, setForm] = useState({ referrer_name: '', referrer_mobile: '', friend_name: '', friend_contact: '', friend_offer: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.referrer_name || !form.referrer_mobile || !form.friend_name || !form.friend_contact) return;
    setLoading(true);
    await fetch('/api/referral', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: localStorage.getItem('session_token'), ...form, language: lang }),
    }).catch(() => {});
    router.push('/confirmation?path=referral');
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center"><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center mx-auto mb-4"><Share2 className="w-8 h-8 text-pink-500" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy">Send a Del Mar Perk to a Friend</h2>
          <p className="text-gray-600 mt-2">Share today&apos;s fair perk, cooling offer, or booth info with someone at Del Mar.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-navy">Your info</p>
            <input required placeholder="Your first name *" value={form.referrer_name} onChange={e => setForm({ ...form, referrer_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none bg-white" />
            <input required placeholder="Your mobile number *" type="tel" value={form.referrer_mobile} onChange={e => setForm({ ...form, referrer_mobile: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none bg-white" />
          </div>
          <div className="bg-pink-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-navy">Friend&apos;s info</p>
            <input required placeholder="Friend's first name *" value={form.friend_name} onChange={e => setForm({ ...form, friend_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none bg-white" />
            <input required placeholder="Friend's mobile or email *" value={form.friend_contact} onChange={e => setForm({ ...form, friend_contact: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none bg-white" />
          </div>
          <div><label className="text-sm font-medium text-navy mb-2 block">What should they see?</label>
            <div className="grid grid-cols-2 gap-2">{OFFERS.map(o => (<button key={o} type="button" onClick={() => setForm({ ...form, friend_offer: o })} className={`py-3 rounded-xl border-2 text-sm font-medium transition ${form.friend_offer === o ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-600'}`}>{o}</button>))}</div>
          </div>
          <Button type="submit" fullWidth loading={loading} size="lg">Send Perk to Friend</Button>
        </form>
      </main>
    </div>
  );
}

export default function ReferralPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}><ReferralContent /></Suspense>;
}
