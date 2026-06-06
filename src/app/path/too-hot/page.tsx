'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Flame } from 'lucide-react';
import Button from '@/components/ui/Button';

const LOCATIONS = ['Home', 'Office', 'Garage', 'Patio', 'Booth', 'Bedroom', 'Other'];

function TooHotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const [form, setForm] = useState({ first_name: '', mobile_number: '', email: '', cooling_location: '', at_del_mar: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.mobile_number) return;
    setLoading(true);
    const tags = ['TOO_HOT', 'COOLING_INTEREST', 'COOLERPADS_PATH', 'EVENT_OFFER_INTEREST', 'COOKIE_PERK_ELIGIBLE'];
    if (form.at_del_mar === 'yes') tags.push('AT_FAIR_TODAY');
    await fetch('/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: localStorage.getItem('session_token'), ...form, at_del_mar_today: form.at_del_mar === 'yes', selected_path: 'too-hot', tags, language: lang,
        responses: form.cooling_location ? [{ question: 'Where do you need cooling?', answer: form.cooling_location }] : [],
      }),
    }).catch(() => {});
    router.push('/confirmation?path=too-hot');
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center"><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4"><Flame className="w-8 h-8 text-red-500" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy">Need Cooler Air at Del Mar or at Home?</h2>
          <p className="text-gray-600 mt-2">The Del Mar booth is demonstrating portable cooling and comfort products for warm spaces.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
          <input required placeholder="First name *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input required placeholder="Mobile number *" type="tel" value={form.mobile_number} onChange={e => setForm({ ...form, mobile_number: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input placeholder="Email (optional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <div>
            <label className="text-sm font-medium text-navy mb-2 block">Where do you need cooling?</label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map(l => (
                <button key={l} type="button" onClick={() => setForm({ ...form, cooling_location: l })}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${form.cooling_location === l ? 'border-cooling-blue bg-blue-50 text-cooling-dark' : 'border-gray-200 text-gray-600'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-2 block">Are you at Del Mar today?</label>
            <div className="flex gap-3">
              {['yes', 'no'].map(v => (<button key={v} type="button" onClick={() => setForm({ ...form, at_del_mar: v })} className={`flex-1 py-3 rounded-xl border-2 font-medium capitalize transition ${form.at_del_mar === v ? 'border-orange bg-orange/10 text-orange' : 'border-gray-200 text-gray-600'}`}>{v}</button>))}
            </div>
          </div>
          <Button type="submit" fullWidth loading={loading} size="lg">Get Cooling Info</Button>
        </form>
      </main>
    </div>
  );
}

export default function TooHotPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}><TooHotContent /></Suspense>;
}
