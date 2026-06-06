export interface Session {
  id: string;
  session_token: string;
  event_name: string;
  page: string;
  domain: string | null;
  partner_offer: string;
  qr_source: string | null;
  qr_location: string | null;
  language: string;
  first_click_path: string | null;
  selected_path: string | null;
  device_type: string | null;
  completed: boolean;
  consent_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionCreate {
  session_token: string;
  event_name?: string;
  page?: string;
  domain?: string;
  partner_offer?: string;
  qr_source?: string;
  qr_location?: string;
  language?: string;
  device_type?: string;
  consent_status?: string;
}

export interface SessionUpdate {
  first_click_path?: string;
  selected_path?: string;
  completed?: boolean;
  language?: string;
}
