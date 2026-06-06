'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ShoppingBag, Cookie, Share2, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';

const PICKUP = ['Took it today', 'Holding for pickup', 'Need follow-up'];
const UNITS = ['1', '2', '3+'];

function AlreadyBoughtContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const [form, setForm] = useState({ first_name: '', mobile_number: '', email: '', purchase_date: '', units_purchased: '', pickup_status: '', salesperson: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.mobile_number || !form.email) return;
    setLoading(true);
    await fetch('/api/buyer', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: localStorage.getItem('session_token'), ...form, language: lang }),
    }).catch(() => {});
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen fair-gradient-light">
        <header className="fair-gradient text-white py-4 px-4 text-center"><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></header>
        <main className="max-w-lg mx-auto px-4 py-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><ShoppingBag className="w-8 h-8 text-green-600" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Purchase Registered!</h2>
          <p className="text-gray-600 mb-6">Your purchase registration was received.</p>
          <div className="space-y-3">
            <button onClick={() => router.push('/path/cookie-perk')} className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-cookie-tan bg-amber-50 text-amber-800 font-medium"><Cookie className="w-5 h-5" />Get cookie perk</button>
            <button onClick={() => router.push('/path/referral')} className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-pink-300 bg-pink-50 text-pink-800 font-medium"><Share2 className="w-5 h-5" />Refer a friend</button>
            <button onClick={() => router.push('/confirmation?path=already-bought&note=true')} className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-indigo-300 bg-indigo-50 text-indigo-800 font-medium"><MessageSquare className="w-5 h-5" />Leave a quick customer note</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center"><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4"><ShoppingBag className="w-8 h-8 text-purple-600" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy">Register Your Del Mar Purchase</h2>
          <p className="text-gray-600 mt-2">Register your purchase for support, follow-up, referral tracking, and available Del Mar perks.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
          <input required placeholder="First name *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input required placeholder="Mobile number *" type="tel" value={form.mobile_number} onChange={e => setForm({ ...form, mobile_number: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input required placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <div><label className="text-sm font-medium text-navy mb-1 block">Purchase date</label><input type="date" value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" /></div>
          <div><label className="text-sm font-medium text-navy mb-2 block">Units purchased</label><div className="flex gap-3">{UNITS.map(u => (<button key={u} type="button" onClick={() => setForm({ ...form, units_purchased: u })} className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${form.units_purchased === u ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}>{u}</button>))}</div></div>
          <div><label className="text-sm font-medium text-navy mb-2 block">Pickup status</label><div className="space-y-2">{PICKUP.map(p => (<button key={p} type="button" onClick={() => setForm({ ...form, pickup_status: p })} className={`w-full py-3 rounded-xl border-2 text-sm font-medium transition ${form.pickup_status === p ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}>{p}</button>))}</div></div>
          <input placeholder="Salesperson (if known)" value={form.salesperson} onChange={e => setForm({ ...form, salesperson: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <Button type="submit" fullWidth loading={loading} size="lg">Register Purchase</Button>
        </form>
      </main>
    </div>
  );
}

export default function AlreadyBoughtPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}><AlreadyBoughtContent /></Suspense>;
}
