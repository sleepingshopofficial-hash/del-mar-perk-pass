'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2, Cookie, Wind, MapPin, Star, Share2, ShoppingBag } from 'lucide-react';

const PATH_MESSAGES: Record<string, { title: string; subtitle: string; icon: React.ElementType; color: string; instruction: string }> = {
  'cookie-perk': { title: 'Cookie Perk Ready!', subtitle: 'Show this screen at the booth for your free cookie perk.', icon: Cookie, color: 'bg-amber-100 text-amber-700', instruction: 'Present this to any team member at the participating booth.' },
  'too-hot': { title: 'Cooling Info Sent!', subtitle: "We've got your info. Cooling comfort is on the way.", icon: Wind, color: 'bg-red-100 text-red-600', instruction: "Visit the CoolerPads booth to see today's demo and available offers." },
  'cooling-offer': { title: 'Offer Claimed!', subtitle: "Show this screen at the booth for today's cooling offer.", icon: Wind, color: 'bg-blue-100 text-cooling-dark', instruction: "Present this to the booth team to ask about today's event pricing." },
  'at-booth': { title: 'Checked In!', subtitle: 'The booth team can see your scan.', icon: MapPin, color: 'bg-green-100 text-green-700', instruction: 'Ask any booth team member for assistance.' },
  'already-bought': { title: 'Purchase Registered!', subtitle: 'Thanks for buying. Your registration is saved.', icon: ShoppingBag, color: 'bg-purple-100 text-purple-700', instruction: 'Check your messages for follow-up, perks, and referral info.' },
  'referral': { title: 'Referral Sent!', subtitle: "Your friend will receive the perk info.", icon: Share2, color: 'bg-pink-100 text-pink-600', instruction: 'Your friend will get a message about available Del Mar perks.' },
  'future-perks': { title: "You're on the List!", subtitle: "You'll hear about future fair perks and offers.", icon: Star, color: 'bg-indigo-100 text-indigo-600', instruction: 'Watch for messages about upcoming fair events and exclusive perks.' },
  'espanol': { title: '¡Tu galleta está lista!', subtitle: 'Muestra esta pantalla en el puesto para tu galleta gratis.', icon: Cookie, color: 'bg-amber-100 text-amber-700', instruction: 'Presenta esto a cualquier miembro del equipo en el puesto participante.' },
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const path = searchParams.get('path') || 'cookie-perk';
  const lang = searchParams.get('lang') || 'en';
  const msg = PATH_MESSAGES[path] || PATH_MESSAGES['cookie-perk'];
  const Icon = msg.icon;

  const handleCoolerPads = () => {
    const token = localStorage.getItem('session_token') || '';
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token, event_type: 'coolerpads_click', page_path: '/confirmation' }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen fair-gradient-light flex flex-col">
      <header className="fair-gradient text-white py-4 px-4 text-center">
        <h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <div className="text-center animate-fade-in-up space-y-6 w-full">
          <div className="relative">
            <div className={`w-20 h-20 rounded-full ${msg.color} flex items-center justify-center mx-auto`}>
              <Icon className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 left-1/2 ml-4">
              <CheckCircle2 className="w-8 h-8 text-success fill-white" />
            </div>
          </div>

          <h2 className="font-heading text-3xl font-bold text-navy">{msg.title}</h2>
          <p className="text-gray-600 text-lg">{msg.subtitle}</p>

          <div className="bg-white rounded-2xl border-2 border-orange/20 p-6 shadow-sm">
            <p className="text-navy font-medium">{msg.instruction}</p>
          </div>

          <p className="text-xs text-gray-400">
            {lang === 'es' ? 'Sujeto a confirmación del puesto y disponibilidad diaria.' : 'Subject to booth confirmation and daily availability.'}
          </p>
        </div>
      </main>
      <footer className="py-6 px-4 text-center space-y-3 border-t border-gray-100">
        <a href="https://coolerpads.com" target="_blank" rel="noopener noreferrer" onClick={handleCoolerPads}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-cooling-blue text-cooling-dark font-semibold text-sm hover:bg-cooling-blue hover:text-white transition-all">
          <Wind className="w-4 h-4" /> Visit CoolerPads.com
        </a>
        <p className="text-xs text-gray-400">© 2026 Del Mar Fair Perk Pass</p>
      </footer>
    </div>
  );
}

export default function ConfirmationPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>}><ConfirmationContent /></Suspense>;
}
