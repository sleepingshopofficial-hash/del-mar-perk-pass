'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Cookie, Wind, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qr_source = searchParams.get('qr_source') || '';
    const qr_location = searchParams.get('qr_location') || '';
    const token = crypto.randomUUID();
    localStorage.setItem('session_token', token);
    localStorage.setItem('qr_source', qr_source);
    localStorage.setItem('qr_location', qr_location);

    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_token: token,
        domain: window.location.hostname,
        qr_source, qr_location,
        device_type: /Mobi/i.test(navigator.userAgent) ? 'mobile' : /Tablet/i.test(navigator.userAgent) ? 'tablet' : 'desktop',
        language: 'en',
      }),
    }).then(r => r.json()).then(d => {
      if (d.id) localStorage.setItem('session_id', d.id);
    }).catch(() => {});

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token, event_type: 'landing_view', page_path: '/' }),
    }).catch(() => {});
  }, [searchParams]);

  const handleStart = () => {
    const token = localStorage.getItem('session_token') || '';
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token, event_type: 'cta_click', page_path: '/' }),
    }).catch(() => {});
    router.push('/start');
  };

  const handleCoolerPadsClick = () => {
    const token = localStorage.getItem('session_token') || '';
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token, event_type: 'coolerpads_click', page_path: '/' }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen fair-gradient-light flex flex-col">
      {/* Header */}
      <header className="fair-gradient text-white py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-orange" />
          <span className="text-sm font-medium tracking-wide uppercase text-orange-light">Del Mar 2026</span>
          <Sparkles className="w-5 h-5 text-orange" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Del Mar Fair Perk Pass</h1>
        <p className="text-xs text-white/70 mt-1 flex items-center justify-center gap-1">
          <Cookie className="w-3 h-3" /> Cookie perk powered by Mom&apos;s Bakeshoppe
        </p>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <div className="animate-fade-in-up text-center space-y-6 w-full">
          {/* Icon cluster */}
          <div className="flex justify-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-cookie-light flex items-center justify-center shadow-md">
              <Cookie className="w-8 h-8 text-cookie-tan" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shadow-md">
              <Wind className="w-8 h-8 text-cooling-blue" />
            </div>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy leading-tight">
            Claim Your Del Mar Fair Perk
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
            Choose what brought you here. We&apos;ll show the right cookie perk, cooling offer, booth support, or follow-up path.
          </p>

          <Button onClick={handleStart} fullWidth size="lg" className="text-xl py-5 shadow-lg animate-fade-in-up animate-delay-200">
            Click Here to Start
          </Button>

          <p className="text-sm text-gray-500">Takes about 30 seconds. Show your result at the booth.</p>
          <p className="text-xs text-gray-400">Offer subject to booth confirmation and daily availability.</p>
        </div>
      </main>

      {/* Footer with CoolerPads button */}
      <footer className="py-6 px-4 text-center space-y-3 border-t border-gray-100">
        <a
          href="https://coolerpads.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCoolerPadsClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-cooling-blue text-cooling-dark font-semibold text-sm hover:bg-cooling-blue hover:text-white transition-all"
        >
          <Wind className="w-4 h-4" /> Visit CoolerPads.com
        </a>
        <p className="text-xs text-gray-400">© 2026 Del Mar Fair Perk Pass</p>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen fair-gradient-light flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}>
      <LandingContent />
    </Suspense>
  );
}
