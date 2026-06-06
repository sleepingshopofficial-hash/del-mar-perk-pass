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
    const tags = ['REFERRAL', 'REFERRED_LEAD'];
    if (body.friend_offer === 'Cookie perk' || body.friend_offer === 'Both') tags.push('COOKIE_REFERRAL');
    if (body.friend_offer === 'Cooling offer' || body.friend_offer === 'Both') tags.push('COOLING_REFERRAL');
    const { data: lead } = await supabase.from('leads').insert({
      session_id, first_name: sanitizeInput(body.referrer_name), mobile_number: sanitizeInput(body.referrer_mobile),
      selected_path: 'referral', completed_form: true, language: body.language || 'en', lead_score: 60,
    }).select().single();
    if (!lead) return NextResponse.json({ error: 'Failed' }, { status: 500 });
    await supabase.from('lead_tags').insert(tags.map(tag => ({ lead_id: lead.id, tag })));
    const { data: referral, error } = await supabase.from('referrals').insert({
      lead_id: lead.id, referrer_name: sanitizeInput(body.referrer_name), referrer_mobile: sanitizeInput(body.referrer_mobile),
      friend_name: sanitizeInput(body.friend_name), friend_contact: sanitizeInput(body.friend_contact), friend_offer: body.friend_offer,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (session_id) await supabase.from('sessions').update({ completed: true, selected_path: 'referral' }).eq('id', session_id);
    await supabase.from('analytics_events').insert({ session_id, event_type: 'referral_submitted', page_path: '/path/referral' });

    // Sync to Google Sheets
    try {
      const sheetsSynced = await appendToGoogleSheet({
        type: 'referral',
        data: {
          id: referral.id,
          referrer_name: referral.referrer_name,
          referrer_mobile: referral.referrer_mobile,
          friend_name: referral.friend_name,
          friend_contact: referral.friend_contact,
          friend_offer: referral.friend_offer,
          created_at: referral.created_at
        }
      });
      if (sheetsSynced) {
        await supabase.from('leads').update({ synced_to_sheets: true, sheets_synced_at: new Date().toISOString() }).eq('id', lead.id);
      }
    } catch (err) {
      console.error('Google Sheets sync failed:', err);
    }

    return NextResponse.json({ referral_id: referral?.id, lead_id: lead.id });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
