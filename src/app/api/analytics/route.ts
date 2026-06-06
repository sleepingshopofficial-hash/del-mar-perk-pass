import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    // Look up session_id from token
    let session_id = body.session_id || null;
    if (!session_id && body.session_token) {
      const { data: s } = await supabase.from('sessions').select('id').eq('session_token', body.session_token).single();
      if (s) session_id = s.id;
    }
    await supabase.from('analytics_events').insert({
      session_id,
      event_type: body.event_type,
      event_data: body.event_data || {},
      page_path: body.page_path || null,
    });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 400 }); }
}
