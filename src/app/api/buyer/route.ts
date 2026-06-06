import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { sanitizeInput } from '@/lib/security/sanitize';
import { appendToGoogleSheet } from '@/lib/sheets/sync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    let session_id = null;
    if (body.session_token) {
      const { data: s } = await supabase.from('sessions').select('id').eq('session_token', body.session_token).single();
      if (s) session_id = s.id;
    }
    const tags = ['BUYER', 'REGISTERED_BUYER', 'COOKIE_PERK_ELIGIBLE', 'REFERRAL_PROMPTED', 'TESTIMONIAL_PROMPTED'];
    if (body.pickup_status === 'Holding for pickup' || body.pickup_status === 'Need follow-up') tags.push('PICKUP_NEEDED');
    const { data: lead } = await supabase.from('leads').insert({
      session_id, first_name: sanitizeInput(body.first_name), mobile_number: sanitizeInput(body.mobile_number),
      email: sanitizeInput(body.email), selected_path: 'already-bought', completed_form: true,
      language: body.language || 'en', lead_score: 80,
    }).select().single();
    if (!lead) return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    await supabase.from('lead_tags').insert(tags.map(tag => ({ lead_id: lead.id, tag })));
    const { data: buyer, error } = await supabase.from('buyers').insert({
      lead_id: lead.id, purchase_date: body.purchase_date || null, units_purchased: body.units_purchased,
      pickup_status: body.pickup_status, salesperson: body.salesperson || null,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (session_id) await supabase.from('sessions').update({ completed: true, selected_path: 'already-bought' }).eq('id', session_id);
    await supabase.from('analytics_events').insert({ session_id, event_type: 'buyer_registered', page_path: '/path/already-bought' });

    // Sync to Google Sheets
    try {
      const sheetsSynced = await appendToGoogleSheet({
        type: 'buyer',
        data: {
          id: buyer.id,
          first_name: lead.first_name,
          mobile_number: lead.mobile_number,
          email: lead.email,
          purchase_date: buyer.purchase_date,
          units_purchased: buyer.units_purchased,
          pickup_status: buyer.pickup_status,
          salesperson: buyer.salesperson,
          created_at: buyer.created_at
        }
      });
      if (sheetsSynced) {
        await supabase.from('leads').update({ synced_to_sheets: true, sheets_synced_at: new Date().toISOString() }).eq('id', lead.id);
      }
    } catch (err) {
      console.error('Google Sheets sync failed:', err);
    }

    return NextResponse.json({ buyer_id: buyer?.id, lead_id: lead.id });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
