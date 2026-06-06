/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';

interface SyncData {
  type: 'lead' | 'buyer' | 'referral';
  data: Record<string, any>;
}

function generateJWT(email: string, privateKey: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  })).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const formattedKey = privateKey.replace(/\\n/g, '\n');
  const signature = sign.sign(formattedKey, 'base64url');
  return `${header}.${payload}.${signature}`;
}

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const jwt = generateJWT(email, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain Google access token: ${errText}`);
  }
  const data = await res.json();
  return data.access_token;
}

export async function appendToGoogleSheet(sync: SyncData): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.log('Google Sheets environment variables are not fully configured. Skipping sheet sync.');
    return false;
  }

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey);
    let tabName = 'Leads';
    let rowValues: any[] = [];

    if (sync.type === 'lead') {
      tabName = 'Leads';
      rowValues = [
        sync.data.id || '',
        sync.data.first_name || '',
        sync.data.mobile_number || '',
        sync.data.email || '',
        sync.data.at_del_mar_today ? 'Yes' : 'No',
        sync.data.selected_path || '',
        sync.data.lead_score || 0,
        sync.data.created_at || new Date().toISOString()
      ];
    } else if (sync.type === 'buyer') {
      tabName = 'Buyers';
      rowValues = [
        sync.data.id || '',
        sync.data.first_name || '',
        sync.data.mobile_number || '',
        sync.data.email || '',
        sync.data.purchase_date || '',
        sync.data.units_purchased || '',
        sync.data.pickup_status || '',
        sync.data.salesperson || '',
        sync.data.created_at || new Date().toISOString()
      ];
    } else if (sync.type === 'referral') {
      tabName = 'Referrals';
      rowValues = [
        sync.data.id || '',
        sync.data.referrer_name || '',
        sync.data.referrer_mobile || '',
        sync.data.friend_name || '',
        sync.data.friend_contact || '',
        sync.data.friend_offer || '',
        sync.data.created_at || new Date().toISOString()
      ];
    }

    const range = `${tabName}!A:Z`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [rowValues]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Google Sheets Append API returned error: ${errText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    return false;
  }
}
