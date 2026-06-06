'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Star } from 'lucide-react';
import Button from '@/components/ui/Button';

const INTERESTS = ['Cooling offers', 'Food perks', 'Family deals', 'Future fairs', 'Referral rewards', 'Vendor opportunities'];

function FuturePerksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const [form, setForm] = useState({ first_name: '', mobile_number: '', email: '', interests: [] as string[] });
  const [loading, setLoading] = useState(false);

  const toggleInterest = (i: string) => {
    setForm(f => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.mobile_number) return;
    setLoading(true);
    const tags = ['FUTURE_FAIR_PERKS', 'MONTHIFY_CANDIDATE', 'EVENT_UPDATES', 'MEMBERSHIP_INTEREST'];
    if (form.interests.length > 0) tags.push('INTEREST_CATEGORY');
    await fetch('/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: localStorage.getItem('session_token'), ...form, selected_path: 'future-perks', tags, language: lang,
        responses: form.interests.map(i => ({ question: 'Interest category', answer: i })),
      }),
    }).catch(() => {});
    router.push('/confirmation?path=future-perks');
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center"><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4"><Star className="w-8 h-8 text-indigo-500" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy">Want Future Fair Perks?</h2>
          <p className="text-gray-600 mt-2">Join the Del Mar follow-up list for future event offers, booth perks, referrals, product updates, and participating fair promotions.</p>
          <p className="text-xs text-gray-400 mt-2 italic">This may become part of a future fair perk membership where visitors can receive offers, rewards, reminders, and participating booth benefits after the event ends.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
          <input required placeholder="First name *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input required placeholder="Mobile number *" type="tel" value={form.mobile_number} onChange={e => setForm({ ...form, mobile_number: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
          <div><label className="text-sm font-medium text-navy mb-2 block">Interested in:</label>
            <div className="grid grid-cols-2 gap-2">{INTERESTS.map(i => (
              <button key={i} type="button" onClick={() => toggleInterest(i)} className={`py-3 px-3 rounded-xl border-2 text-sm font-medium transition ${form.interests.includes(i) ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>{i}</button>
            ))}</div>
          </div>
          <Button type="submit" fullWidth loading={loading} size="lg">Join Future Perks List</Button>
        </form>
      </main>
    </div>
  );
}

export default function FuturePerksPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}><FuturePerksContent /></Suspense>;
}
