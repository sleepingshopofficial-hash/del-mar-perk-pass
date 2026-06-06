import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = createAdminSupabaseClient();
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = admin.from('leads').select('*, lead_tags(tag)', { count: 'exact' });
  if (q) query = query.or(`first_name.ilike.%${q}%,mobile_number.ilike.%${q}%,email.ilike.%${q}%`);
  const { data, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  return NextResponse.json({ leads: data || [], total: count || 0, page, limit });
}
