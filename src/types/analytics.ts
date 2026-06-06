export interface AnalyticsEvent {
  id: string;
  session_id: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  page_path: string | null;
  created_at: string;
}

export type EventType =
  | 'landing_view'
  | 'cta_click'
  | 'path_selected'
  | 'question_answered'
  | 'field_entered'
  | 'form_submitted'
  | 'referral_submitted'
  | 'buyer_registered'
  | 'confirmation_viewed'
  | 'session_abandoned'
  | 'coolerpads_click'
  | 'button_clicked';
