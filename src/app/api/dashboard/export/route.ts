/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = createAdminSupabaseClient();
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'leads';

  let csv = '';
  if (type === 'leads') {
    const { data } = await admin.from('leads').select('*, lead_tags(tag)').order('created_at', { ascending: false });
    csv = 'ID,First Name,Mobile,Email,Path,Completed,Language,Score,Tags,Created\n';
    (data || []).forEach(l => {
      const tags = (l.lead_tags || []).map((t: any) => t.tag).join(';');
      csv += `${l.id},${l.first_name || ''},${l.mobile_number || ''},${l.email || ''},${l.selected_path || ''},${l.completed_form},${l.language},${l.lead_score},"${tags}",${l.created_at}\n`;
    });
  } else if (type === 'buyers') {
    const { data } = await admin.from('buyers').select('*, leads(first_name, mobile_number, email)').order('created_at', { ascending: false });
    csv = 'ID,Name,Mobile,Email,Purchase Date,Units,Pickup,Salesperson,Created\n';
    (data || []).forEach(b => {
      const l = (b as any).leads || {};
      csv += `${b.id},${l.first_name || ''},${l.mobile_number || ''},${l.email || ''},${b.purchase_date || ''},${b.units_purchased || ''},${b.pickup_status || ''},${b.salesperson || ''},${b.created_at}\n`;
    });
  } else if (type === 'referrals') {
    const { data } = await admin.from('referrals').select('*').order('created_at', { ascending: false });
    csv = 'ID,Referrer,Referrer Mobile,Friend,Friend Contact,Offer,Created\n';
    (data || []).forEach(r => {
      csv += `${r.id},${r.referrer_name},${r.referrer_mobile},${r.friend_name},${r.friend_contact},${r.friend_offer || ''},${r.created_at}\n`;
    });
  }
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="${type}_export.csv"` } });
}
