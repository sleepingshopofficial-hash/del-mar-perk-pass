import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { appendToGoogleSheet } from '@/lib/sheets/sync';

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminSupabaseClient();
  const { data: unsynced } = await admin.from('leads').select('*').eq('synced_to_sheets', false);
  if (!unsynced || unsynced.length === 0) return NextResponse.json({ message: 'No new leads to sync', synced: 0 });

  let syncedCount = 0;
  for (const lead of unsynced) {
    let success = false;
    try {
      if (lead.selected_path === 'already-bought') {
        const { data: buyer } = await admin.from('buyers').select('*').eq('lead_id', lead.id).maybeSingle();
        if (buyer) {
          success = await appendToGoogleSheet({
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
        }
      } else if (lead.selected_path === 'referral') {
        const { data: referral } = await admin.from('referrals').select('*').eq('lead_id', lead.id).maybeSingle();
        if (referral) {
          success = await appendToGoogleSheet({
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
        }
      } else {
        success = await appendToGoogleSheet({
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
      }

      if (success) {
        await admin.from('leads').update({ synced_to_sheets: true, sheets_synced_at: new Date().toISOString() }).eq('id', lead.id);
        syncedCount++;
      }
    } catch (err) {
      console.error(`Error syncing lead ${lead.id} to Google Sheets:`, err);
    }
  }

  if (syncedCount === 0) {
    return NextResponse.json({
      message: 'Failed to sync records to Google Sheets. Verify your GOOGLE_SHEETS_* environment variables.',
      synced: 0
    }, { status: 500 });
  }

  return NextResponse.json({
    message: `Successfully synced ${syncedCount} records to Google Sheets.`,
    synced: syncedCount
  });
}
