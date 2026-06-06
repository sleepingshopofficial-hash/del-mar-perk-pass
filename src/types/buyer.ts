export interface Buyer {
  id: string;
  lead_id: string;
  purchase_date: string | null;
  units_purchased: string | null;
  pickup_status: string | null;
  salesperson: string | null;
  created_at: string;
}

export interface BuyerCreate {
  session_id?: string;
  first_name: string;
  mobile_number: string;
  email: string;
  purchase_date?: string;
  units_purchased: string;
  pickup_status: string;
  salesperson?: string;
}
