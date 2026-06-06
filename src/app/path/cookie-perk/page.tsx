'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Cookie, Wind, Tag, Clock, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const SORTING = [
  { label: 'I need to cool down', icon: Wind, tag: 'COOLING_INTEREST' },
  { label: 'I want a good fair deal', icon: Tag, tag: 'FAIR_DEAL_INTEREST' },
  { label: "I'm just here for the cookies", icon: Cookie, tag: '' },
  { label: 'I may want follow-up later', icon: Clock, tag: 'FOLLOWUP_LATER' },
  { label: 'I want to share this with someone', icon: Share2, tag: 'REFERRAL_INTEREST' },
];

function CookiePerkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const [step, setStep] = useState<'sorting' | 'form'>('sorting');
  const [sortTag, setSortTag] = useState('');
  const [form, setForm] = useState({ first_name: '', mobile_number: '', email: '', at_del_mar: '' });
  const [loading, setLoading] = useState(false);

  const handleSort = (tag: string) => {
    setSortTag(tag);
    const token = localStorage.getItem('session_token') || '';
    fetch('/api/analytics', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token, event_type: 'question_answered', event_data: { answer: tag }, page_path: '/path/cookie-perk' }),
    }).catch(() => {});
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.mobile_number) return;
    setLoading(true);
    const tags = ['COOKIE_PERK', 'COOKIE_FIRST'];
    if (sortTag) tags.push(sortTag);
    if (form.at_del_mar === 'yes') tags.push('AT_FAIR_TODAY');

    await fetch('/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_token: localStorage.getItem('session_token'),
        ...form, at_del_mar_today: form.at_del_mar === 'yes',
        selected_path: 'cookie-perk', tags, language: lang,
        responses: sortTag ? [{ question: 'What would help you most today?', answer: sortTag }] : [],
      }),
    }).catch(() => {});
    router.push('/confirmation?path=cookie-perk');
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center">
        <h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-cookie-light flex items-center justify-center mx-auto mb-4">
            <Cookie className="w-8 h-8 text-cookie-tan" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-navy">Your Del Mar Cookie Perk</h2>
          <p className="text-gray-600 mt-2">Thanks for scanning. This Del Mar perk is connected to participating booths at the fair.</p>
        </div>

        {step === 'sorting' && (
          <div className="space-y-3 animate-fade-in-up">
            <h3 className="font-heading text-lg font-semibold text-navy text-center">While you&apos;re here, what would help you most today?</h3>
            {SORTING.map((s, i) => (
              <button key={i} onClick={() => handleSort(s.tag)} className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-cookie-tan/30 bg-white text-navy font-medium hover:border-cookie-tan hover:shadow-md transition-all">
                <s.icon className="w-5 h-5 text-cookie-tan" />{s.label}
              </button>
            ))}
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
            <input required placeholder="First name *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
            <input required placeholder="Mobile number *" type="tel" value={form.mobile_number} onChange={e => setForm({ ...form, mobile_number: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
            <input placeholder="Email (optional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Are you at Del Mar today?</label>
              <div className="flex gap-3">
                {['yes', 'no'].map(v => (
                  <button key={v} type="button" onClick={() => setForm({ ...form, at_del_mar: v })}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium capitalize transition ${form.at_del_mar === v ? 'border-orange bg-orange/10 text-orange' : 'border-gray-200 text-gray-600'}`}>{v}</button>
                ))}
              </div>
            </div>
            <Button type="submit" fullWidth loading={loading} size="lg">Get Your Cookie Perk</Button>
          </form>
        )}
      </main>
    </div>
  );
}

export default function CookiePerkPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}><CookiePerkContent /></Suspense>;
}
