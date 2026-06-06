export interface Referral {
  id: string;
  lead_id: string | null;
  referrer_name: string;
  referrer_mobile: string;
  friend_name: string;
  friend_contact: string;
  friend_offer: string | null;
  created_at: string;
}

export interface ReferralCreate {
  session_id?: string;
  referrer_name: string;
  referrer_mobile: string;
  friend_name: string;
  friend_contact: string;
  friend_offer: string;
}
