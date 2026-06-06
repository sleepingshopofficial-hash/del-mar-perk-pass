'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Tag, Cookie, ShoppingBag, HelpCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

const ACTIONS = [
  { label: 'I want the cooling offer', icon: Tag, route: '/path/cooling-offer' },
  { label: 'I want the cookie perk', icon: Cookie, route: '/path/cookie-perk' },
  { label: 'I already bought', icon: ShoppingBag, route: '/path/already-bought' },
  { label: 'I have a question', icon: HelpCircle, route: null },
];

export default function AtBoothPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: '', mobile_number: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = (route: string | null) => {
    const token = localStorage.getItem('session_token') || '';
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_token: token, event_type: 'button_clicked', page_path: '/path/at-booth' }) }).catch(() => {});
    if (route) router.push(route);
    else setSubmitted(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: localStorage.getItem('session_token'), first_name: form.first_name || 'Booth Visitor', mobile_number: form.mobile_number || '', selected_path: 'at-booth', tags: ['AT_BOOTH_NOW', 'LIVE_VISITOR', 'FAST_PATH'], language: 'en' }),
    }).catch(() => {});
    router.push('/confirmation?path=at-booth');
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center"><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-green-600" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy">Show This to the Booth Team</h2>
          <p className="text-gray-600 mt-2">You scanned the Del Mar Fair Perk Pass. Show this screen at the booth for today&apos;s available offer or next step.</p>
        </div>

        {!submitted ? (
          <div className="space-y-3 animate-fade-in-up">
            {ACTIONS.map((a, i) => (
              <button key={i} onClick={() => handleAction(a.route)} className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-green-200 bg-white text-navy font-medium hover:border-green-400 hover:shadow-md transition-all">
                <a.icon className="w-5 h-5 text-green-600" />{a.label}
              </button>
            ))}
            <div className="pt-4">
              <p className="text-sm text-gray-500 text-center mb-3">Optional — leave your info for follow-up:</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input placeholder="First name (optional)" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
                <input placeholder="Mobile (optional)" type="tel" value={form.mobile_number} onChange={e => setForm({ ...form, mobile_number: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
                <Button type="submit" fullWidth loading={loading} variant="secondary">Submit</Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center animate-fade-in p-6 bg-green-50 rounded-2xl border-2 border-green-200">
            <p className="text-lg font-semibold text-green-700">Ask the booth team — they&apos;ll help you out!</p>
          </div>
        )}
      </main>
    </div>
  );
}
