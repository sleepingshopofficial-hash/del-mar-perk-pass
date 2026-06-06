'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cookie, Wind, Tag, Clock, Share2, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';

const SORTING = [
  { label: 'Necesito refrescarme', icon: Wind, tag: 'COOLING_INTEREST' },
  { label: 'Quiero una buena oferta', icon: Tag, tag: 'FAIR_DEAL_INTEREST' },
  { label: 'Solo vengo por las galletas', icon: Cookie, tag: '' },
  { label: 'Quiero seguimiento después', icon: Clock, tag: 'FOLLOWUP_LATER' },
  { label: 'Quiero compartir con alguien', icon: Share2, tag: 'REFERRAL_INTEREST' },
];

export default function EspanolPage() {
  const router = useRouter();
  const [step, setStep] = useState<'sorting' | 'form'>('sorting');
  const [sortTag, setSortTag] = useState('');
  const [form, setForm] = useState({ first_name: '', mobile_number: '', email: '', at_del_mar: '' });
  const [loading, setLoading] = useState(false);

  // Track language switch
  useEffect(() => {
    const token = localStorage.getItem('session_token') || '';
    const sid = localStorage.getItem('session_id') || '';
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token, event_type: 'button_clicked', event_data: { action: 'spanish_selected' }, page_path: '/path/espanol' }),
    }).catch(() => {});
    if (sid) fetch('/api/session', { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sid, language: 'es', selected_path: 'espanol' }),
    }).catch(() => {});
  }, []);

  const handleSort = (tag: string) => { setSortTag(tag); setStep('form'); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.mobile_number) return;
    setLoading(true);
    const tags = ['SPANISH', 'COOKIE_PERK', 'COOKIE_FIRST'];
    if (sortTag) tags.push(sortTag);
    if (form.at_del_mar === 'si') tags.push('AT_FAIR_TODAY');
    await fetch('/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: localStorage.getItem('session_token'), ...form, at_del_mar_today: form.at_del_mar === 'si', selected_path: 'espanol', tags, language: 'es',
        responses: sortTag ? [{ question: '¿Qué te ayudaría más hoy?', answer: sortTag }] : [],
      }),
    }).catch(() => {});
    router.push('/confirmation?path=espanol&lang=es');
  };

  return (
    <div className="min-h-screen fair-gradient-light">
      <header className="fair-gradient text-white py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2"><Globe className="w-5 h-5 text-orange" /><h1 className="font-heading text-xl font-bold">Del Mar Fair Perk Pass</h1></div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-cookie-light flex items-center justify-center mx-auto mb-4"><Cookie className="w-8 h-8 text-cookie-tan" /></div>
          <h2 className="font-heading text-2xl font-bold text-navy">Tu pase de Del Mar</h2>
          <p className="text-gray-600 mt-2">Gracias por escanear. Este beneficio está conectado a los puestos participantes en la feria.</p>
        </div>

        {step === 'sorting' && (
          <div className="space-y-3 animate-fade-in-up">
            <h3 className="font-heading text-lg font-semibold text-navy text-center">¿Qué te ayudaría más hoy?</h3>
            {SORTING.map((s, i) => (
              <button key={i} onClick={() => handleSort(s.tag)} className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-cookie-tan/30 bg-white text-navy font-medium hover:border-cookie-tan hover:shadow-md transition-all">
                <s.icon className="w-5 h-5 text-cookie-tan" />{s.label}
              </button>
            ))}
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
            <input required placeholder="Nombre *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
            <input required placeholder="Número de celular *" type="tel" value={form.mobile_number} onChange={e => setForm({ ...form, mobile_number: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
            <input placeholder="Correo electrónico (opcional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange outline-none" />
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">¿Estás en Del Mar hoy?</label>
              <div className="flex gap-3">
                {['si', 'no'].map(v => (<button key={v} type="button" onClick={() => setForm({ ...form, at_del_mar: v })} className={`flex-1 py-3 rounded-xl border-2 font-medium capitalize transition ${form.at_del_mar === v ? 'border-orange bg-orange/10 text-orange' : 'border-gray-200 text-gray-600'}`}>{v === 'si' ? 'Sí' : 'No'}</button>))}
              </div>
            </div>
            <Button type="submit" fullWidth loading={loading} size="lg">Obtener galleta gratis</Button>
          </form>
        )}
      </main>
    </div>
  );
}
