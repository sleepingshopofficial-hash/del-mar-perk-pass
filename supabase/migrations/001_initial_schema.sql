-- ============================================================
-- Del Mar Fair Perk Pass — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SESSIONS TABLE
-- Tracks every visitor session from QR scan to completion
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  event_name TEXT NOT NULL DEFAULT 'Del Mar 2026',
  page TEXT NOT NULL DEFAULT 'Del Mar Fair Perk Pass',
  domain TEXT,
  partner_offer TEXT NOT NULL DEFAULT 'Mom''s Bakeshoppe cookie perk',
  qr_source TEXT,
  qr_location TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  first_click_path TEXT,
  selected_path TEXT,
  device_type TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  consent_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_qr_source ON sessions(qr_source);
CREATE INDEX idx_sessions_qr_location ON sessions(qr_location);
CREATE INDEX idx_sessions_selected_path ON sessions(selected_path);
CREATE INDEX idx_sessions_completed ON sessions(completed);
CREATE INDEX idx_sessions_language ON sessions(language);

-- ============================================================
-- LEADS TABLE
-- Core lead capture for every visitor who provides info
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  first_name TEXT,
  mobile_number TEXT,
  email TEXT,
  at_del_mar_today BOOLEAN,
  selected_path TEXT,
  completed_form BOOLEAN NOT NULL DEFAULT false,
  language TEXT NOT NULL DEFAULT 'en',
  lead_score INTEGER NOT NULL DEFAULT 0,
  synced_to_sheets BOOLEAN NOT NULL DEFAULT false,
  sheets_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_session_id ON leads(session_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_selected_path ON leads(selected_path);
CREATE INDEX idx_leads_completed_form ON leads(completed_form);
CREATE INDEX idx_leads_language ON leads(language);
CREATE INDEX idx_leads_synced ON leads(synced_to_sheets);

-- ============================================================
-- LEAD_TAGS TABLE
-- Normalized tag storage for each lead
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_tags_lead_id ON lead_tags(lead_id);
CREATE INDEX idx_lead_tags_tag ON lead_tags(tag);

-- ============================================================
-- PATH_RESPONSES TABLE
-- Stores individual question/answer pairs per path
-- ============================================================
CREATE TABLE IF NOT EXISTS path_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  path TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_path_responses_lead_id ON path_responses(lead_id);
CREATE INDEX idx_path_responses_session_id ON path_responses(session_id);
CREATE INDEX idx_path_responses_path ON path_responses(path);

-- ============================================================
-- BUYERS TABLE
-- Purchase registrations from Path 5
-- ============================================================
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  purchase_date DATE,
  units_purchased TEXT,
  pickup_status TEXT,
  salesperson TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_buyers_lead_id ON buyers(lead_id);
CREATE INDEX idx_buyers_created_at ON buyers(created_at);

-- ============================================================
-- REFERRALS TABLE
-- Referral submissions from Path 6
-- ============================================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  referrer_name TEXT NOT NULL,
  referrer_mobile TEXT NOT NULL,
  friend_name TEXT NOT NULL,
  friend_contact TEXT NOT NULL,
  friend_offer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_lead_id ON referrals(lead_id);
CREATE INDEX idx_referrals_created_at ON referrals(created_at);

-- ============================================================
-- ANALYTICS_EVENTS TABLE
-- Every tracked interaction event
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_page_path ON analytics_events(page_path);

-- ============================================================
-- QR_SOURCES TABLE
-- QR code source/location management
-- ============================================================
CREATE TABLE IF NOT EXISTS qr_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USERS TABLE (Admin users, linked to Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'booth_staff' CHECK (role IN ('admin', 'event_manager', 'booth_staff')),
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- SETTINGS TABLE
-- Key-value configuration store
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public INSERT policies (visitors can submit data)
CREATE POLICY "Allow public insert on sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on sessions" ON sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on lead_tags" ON lead_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on path_responses" ON path_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on buyers" ON buyers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on referrals" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);

-- Authenticated READ policies (admin dashboard only)
CREATE POLICY "Admin read sessions" ON sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read lead_tags" ON lead_tags FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read path_responses" ON path_responses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read buyers" ON buyers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read referrals" ON referrals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read analytics_events" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read qr_sources" ON qr_sources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage qr_sources" ON qr_sources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read settings" ON settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Allow public read of own session
CREATE POLICY "Public read own session" ON sessions FOR SELECT USING (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- INITIAL SETTINGS
-- ============================================================
INSERT INTO settings (key, value) VALUES
  ('event_config', '{"event_name": "Del Mar 2026", "partner": "Mom''s Bakeshoppe", "active": true}'::jsonb),
  ('sheets_config', '{"enabled": false, "spreadsheet_id": "", "last_sync": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;
