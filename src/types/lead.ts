export interface Lead {
  id: string;
  session_id: string | null;
  first_name: string | null;
  mobile_number: string | null;
  email: string | null;
  at_del_mar_today: boolean | null;
  selected_path: string | null;
  completed_form: boolean;
  language: string;
  lead_score: number;
  synced_to_sheets: boolean;
  sheets_synced_at: string | null;
  created_at: string;
}

export interface LeadCreate {
  session_id?: string;
  first_name: string;
  mobile_number: string;
  email?: string;
  at_del_mar_today?: boolean;
  selected_path: string;
  tags: string[];
  sorting_answer?: string;
  cooling_location?: string;
  units_interested?: string;
  at_booth_now?: boolean;
}

export interface LeadTag {
  id: string;
  lead_id: string;
  tag: string;
  created_at: string;
}
