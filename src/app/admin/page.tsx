'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const r = useRouter();
  useEffect(() => { r.push('/admin/dashboard'); }, [r]);
  return null;
}
