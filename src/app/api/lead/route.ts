import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { sanitizeInput } from '@/lib/security/sanitize';
import { appendToGoogleSheet } from '@/lib/sheets/sync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    // Look up session
    let session_id = null;
    if (body.session_token) {
      const { data: s } = await supabase.from('sessions').select('id').eq('session_token', body.session_token).single();
      if (s) session_id = s.id;
    }
    // Calculate lead score
    const tags: string[] = body.tags || [];
    let score = tags.length * 5;
    if (body.email) score += 10;
    if (body.mobile_number) score += 10;
    score = Math.min(score, 100);
    // Insert lead
    const { data: lead, error } = await supabase.from('leads').insert({
      session_id,
      first_name: sanitizeInput(body.first_name || ''),
      mobile_number: sanitizeInput(body.mobile_number || ''),
      email: body.email ? sanitizeInput(body.email) : null,
      at_del_mar_today: body.at_del_mar_today ?? null,
      selected_path: body.selected_path || null,
      completed_form: true,
      language: body.language || 'en',
      lead_score: score,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    // Insert tags
    if (tags.length > 0 && lead) {
      await supabase.from('lead_tags').insert(tags.map((tag: string) => ({ lead_id: lead.id, tag })));
    }
    // Insert path responses
    if (body.responses && lead) {
      const responses = body.responses.map((r: { question: string; answer: string }) => ({
        lead_id: lead.id, session_id, path: body.selected_path || '', question: r.question, answer: r.answer,
      }));
      await supabase.from('path_responses').insert(responses);
    }
    // Mark session complete
    if (session_id) {
      await supabase.from('sessions').update({ completed: true, selected_path: body.selected_path }).eq('id', session_id);
    }
    // Track event
    await supabase.from('analytics_events').insert({ session_id, event_type: 'form_submitted', event_data: { path: body.selected_path }, page_path: `/path/${body.selected_path}` });

    // Sync to Google Sheets
    try {
      const sheetsSynced = await appendToGoogleSheet({
        type: 'lead',
        data: {
          id: lead.id,
          first_name: lead.first_name,
          mobile_number: lead.mobile_number,
          email: lead.email,
          at_del_mar_today: lead.at_del_mar_today,
          selected_path: lead.selected_path,
          lead_score: lead.lead_score,
          created_at: lead.created_at
        }
      });
      if (sheetsSynced) {
        await supabase.from('leads').update({ synced_to_sheets: true, sheets_synced_at: new Date().toISOString() }).eq('id', lead.id);
      }
    } catch (err) {
      console.error('Google Sheets sync failed:', err);
    }

    return NextResponse.json({ id: lead?.id, lead_score: score });
  } catch { return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 }); }
}
