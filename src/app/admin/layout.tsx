'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { LayoutDashboard, Users, ShoppingBag, Share2, Settings, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Buyers', href: '/admin/buyers', icon: ShoppingBag },
  { label: 'Referrals', href: '/admin/referrals', icon: Share2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user && !pathname.startsWith('/admin/login')) router.push('/admin/login');
      else setUser(user);
      setLoading(false);
    });
  }, [pathname, router, supabase.auth]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full" /></div>;
  if (!user) return null;

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin/login'); };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">Perk Pass Admin</h2>
          <p className="text-gray-400 text-xs">Del Mar 2026</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <a key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${pathname === n.href ? 'bg-orange text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              <n.icon className="w-5 h-5" />{n.label}
            </a>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 w-full"><LogOut className="w-5 h-5" />Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
