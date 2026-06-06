'use client';

import { useRouter } from 'next/navigation';
import { Cookie, Flame, Tag, MapPin, ShoppingBag, Share2, Star, Globe } from 'lucide-react';

const CHOICES = [
  { label: 'I want the free cookie perk', route: '/path/cookie-perk', icon: Cookie, color: 'bg-amber-50 border-cookie-tan text-amber-800' },
  { label: "I'm hot and want cooler air", route: '/path/too-hot', icon: Flame, color: 'bg-red-50 border-red-300 text-red-800' },
  { label: "I want today's Del Mar cooling offer", route: '/path/cooling-offer', icon: Tag, color: 'bg-blue-50 border-cooling-blue text-blue-800' },
  { label: "I'm at the booth now", route: '/path/at-booth', icon: MapPin, color: 'bg-green-50 border-green-300 text-green-800' },
  { label: 'I already bought', route: '/path/already-bought', icon: ShoppingBag, color: 'bg-purple-50 border-purple-300 text-purple-800' },
  { label: 'I want to send this to a friend', route: '/path/referral', icon: Share2, color: 'bg-pink-50 border-pink-300 text-pink-800' },
  { label: 'I want future fair perks', route: '/path/future-perks', icon: Star, color: 'bg-indigo-50 border-indigo-300 text-indigo-800' },
  { label: 'Español', route: '/path/espanol', icon: Globe, color: 'bg-orange-50 border-orange text-orange-800' },
];

export default function StartPage() {
  const router = useRouter();

  const handleSelect = (route: string, label: string) => {
    const token = localStorage.getItem('session_token') || '';
    const sid = localStorage.getItem('session_id') || '';
    // Track path selected
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token, event_type: 'path_selected', event_data: { path: label }, page_path: '/start' }),
    }).catch(() => {});
    // Update session
    if (sid) {
      fetch('/api/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sid, first_click_path: label, selected_path: label }),
      }).catch(() => {});
    }
    router.push(route);
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center">
        <h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy text-center mb-6 animate-fade-in">
          What brought you here today?
        </h2>
        <div className="space-y-3">
          {CHOICES.map((c, i) => (
            <button
              key={c.route}
              onClick={() => handleSelect(c.route, c.label)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 ${c.color} font-semibold text-left transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] animate-fade-in-up`}
              style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
            >
              <c.icon className="w-6 h-6 shrink-0" />
              <span className="text-base">{c.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
