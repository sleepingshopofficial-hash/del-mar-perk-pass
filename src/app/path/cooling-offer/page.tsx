'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Tag } from 'lucide-react';
import Button from '@/components/ui/Button';

const UNITS = ['1 unit', '2 units', '3+ units', 'Not sure'];

function CoolingOfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const [form, setForm] = useState({ first_name: '', mobile_number: '', email: '', units: '', at_booth: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.mobile_number) return;
    setLoading(true);
    const tags = ['COOLING_OFFER', 'HOT_LEAD', 'COOKIE_PERK_ELIGIBLE'];
    if (form.units && form.units !== 'Not sure' && form.units !== '1 unit') tags.push('BUNDLE_INTEREST');
    if (form.at_booth === 'yes') tags.push('AT_BOOTH_NOW');
    await fetch('/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: localStorage.getItem('session_token'), ...form, at_del_mar_today: form.at_booth === 'yes', selected_path: 'cooling-offer', tags, language: lang,
        responses: [{ question: 'Units interested', answer: form.units || 'Not specified' }],
      }),
    }).catch(() => {});
    router.push('/confirmation?path=cooling-offer');
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center"><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4"><Tag className="w-8 h-8 text-cooling-blue" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy">Today&apos;s Del Mar Cooling Offer</h2>
          <p className="text-gray-600 mt-2">Show this screen at the CoolerPads booth to ask about today&apos;s event offer and available bundles.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
          <input required placeholder="First name *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input required placeholder="Mobile number *" type="tel" value={form.mobile_number} onChange={e => setForm({ ...form, mobile_number: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input placeholder="Email (optional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <div>
            <label className="text-sm font-medium text-navy mb-2 block">Interested in:</label>
            <div className="grid grid-cols-2 gap-2">
              {UNITS.map(u => (<button key={u} type="button" onClick={() => setForm({ ...form, units: u })} className={`py-3 rounded-xl border-2 text-sm font-medium transition ${form.units === u ? 'border-cooling-blue bg-blue-50 text-cooling-dark' : 'border-gray-200 text-gray-600'}`}>{u}</button>))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-2 block">At the booth now?</label>
            <div className="flex gap-3">
              {['yes', 'no'].map(v => (<button key={v} type="button" onClick={() => setForm({ ...form, at_booth: v })} className={`flex-1 py-3 rounded-xl border-2 font-medium capitalize transition ${form.at_booth === v ? 'border-orange bg-orange/10 text-orange' : 'border-gray-200 text-gray-600'}`}>{v}</button>))}
            </div>
          </div>
          <Button type="submit" fullWidth loading={loading} size="lg">Get Today&apos;s Offer</Button>
        </form>
      </main>
    </div>
  );
}

export default function CoolingOfferPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}><CoolingOfferContent /></Suspense>;
}
