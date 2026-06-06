import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from('sessions').insert({
      session_token: body.session_token,
      event_name: 'Del Mar 2026',
      page: 'Del Mar Fair Perk Pass',
      domain: body.domain || null,
      partner_offer: "Mom's Bakeshoppe cookie perk",
      qr_source: body.qr_source || null,
      qr_location: body.qr_location || null,
      language: body.language || 'en',
      device_type: body.device_type || null,
      consent_status: body.consent_status || null,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    const updates: Record<string, unknown> = {};
    if (body.first_click_path) updates.first_click_path = body.first_click_path;
    if (body.selected_path) updates.selected_path = body.selected_path;
    if (body.completed !== undefined) updates.completed = body.completed;
    if (body.language) updates.language = body.language;
    const { data, error } = await supabase.from('sessions').update(updates).eq('id', body.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
}
