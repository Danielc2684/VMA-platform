-- ─────────────────────────────────────────────
-- VMA Row-Level Security Policies
-- Apply via Supabase SQL Editor or psql $DIRECT_URL
-- ─────────────────────────────────────────────

-- ── ENABLE RLS ON ALL CRM TABLES ──
ALTER TABLE profiles                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations              ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_packets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps           ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates         ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_comments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests            ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences            ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_steps       ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content               ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications              ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments               ENABLE ROW LEVEL SECURITY;

-- ── ENABLE RLS ON ALL AGENT TABLES ──
ALTER TABLE agent_campaigns              ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_leads                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_email_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_email_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_audit_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_campaign_checkpoints   ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_global_unsubscribes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_global_hard_bounces    ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tenants                ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- HELPER: check caller's role
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role::text FROM profiles WHERE id = auth.uid();
$$;

-- ─────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "profiles: own read"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Staff can read all profiles
CREATE POLICY "profiles: staff read all"
  ON profiles FOR SELECT
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- Users can update their own profile
CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Service role / trigger inserts at registration (auth hook)
CREATE POLICY "profiles: insert own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Admins can update any profile (e.g. change role)
CREATE POLICY "profiles: admin update all"
  ON profiles FOR UPDATE
  USING (get_my_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- organizations
-- ─────────────────────────────────────────────

-- Clients/Viewers see only their own organization
CREATE POLICY "organizations: client read own"
  ON organizations FOR SELECT
  USING (
    id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Staff can read all organizations
CREATE POLICY "organizations: staff read all"
  ON organizations FOR SELECT
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- Only staff can insert/update/delete organizations
CREATE POLICY "organizations: staff write"
  ON organizations FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- leads
-- ─────────────────────────────────────────────

-- Staff can read all leads
CREATE POLICY "leads: staff read"
  ON leads FOR SELECT
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- Staff can write leads
CREATE POLICY "leads: staff write"
  ON leads FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- onboarding_packets + onboarding_steps
-- ─────────────────────────────────────────────

-- Clients see their own org's onboarding packet
CREATE POLICY "onboarding_packets: client read own"
  ON onboarding_packets FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "onboarding_packets: staff all"
  ON onboarding_packets FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "onboarding_steps: client read"
  ON onboarding_steps FOR SELECT
  USING (
    packet_id IN (
      SELECT id FROM onboarding_packets
      WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "onboarding_steps: staff all"
  ON onboarding_steps FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- document_templates
-- ─────────────────────────────────────────────

-- All authenticated users can read active templates
CREATE POLICY "document_templates: authenticated read"
  ON document_templates FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- Only staff can write templates
CREATE POLICY "document_templates: staff write"
  ON document_templates FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- documents
-- ─────────────────────────────────────────────

-- Clients read their org's documents
CREATE POLICY "documents: client read own org"
  ON documents FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Staff can read/write all
CREATE POLICY "documents: staff all"
  ON documents FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- proposals
-- ─────────────────────────────────────────────

-- Clients read their org's proposals
CREATE POLICY "proposals: client read own"
  ON proposals FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Staff all
CREATE POLICY "proposals: staff all"
  ON proposals FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- invoices
-- ─────────────────────────────────────────────

CREATE POLICY "invoices: client read own"
  ON invoices FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "invoices: staff all"
  ON invoices FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- messages
-- ─────────────────────────────────────────────

-- Users read messages they sent or in their org
CREATE POLICY "messages: read own or org"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Any authenticated user can send messages
CREATE POLICY "messages: insert authenticated"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid());

CREATE POLICY "messages: staff all"
  ON messages FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- reports + report_comments
-- ─────────────────────────────────────────────

CREATE POLICY "reports: client read published"
  ON reports FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND status = 'PUBLISHED'
  );

CREATE POLICY "reports: staff all"
  ON reports FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "report_comments: read own report"
  ON report_comments FOR SELECT
  USING (
    report_id IN (
      SELECT id FROM reports
      WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "report_comments: staff all"
  ON report_comments FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- assets
-- ─────────────────────────────────────────────

CREATE POLICY "assets: client read own org"
  ON assets FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "assets: staff all"
  ON assets FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- client_requests
-- ─────────────────────────────────────────────

-- Clients can read and insert their org's requests
CREATE POLICY "client_requests: client read own"
  ON client_requests FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "client_requests: client insert"
  ON client_requests FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND submitted_by = auth.uid()
  );

CREATE POLICY "client_requests: staff all"
  ON client_requests FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- email_sequences + steps + enrollments
-- ─────────────────────────────────────────────

CREATE POLICY "email_sequences: staff all"
  ON email_sequences FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "email_sequence_steps: staff all"
  ON email_sequence_steps FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "email_sequence_enrollments: staff all"
  ON email_sequence_enrollments FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- qr_codes + qr_scans
-- ─────────────────────────────────────────────

-- QR codes are readable by anyone (needed for the redirect endpoint)
CREATE POLICY "qr_codes: public read active"
  ON qr_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "qr_codes: staff all"
  ON qr_codes FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- QR scans can be inserted by anyone (redirect endpoint runs as anon)
CREATE POLICY "qr_scans: insert public"
  ON qr_scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "qr_scans: staff read"
  ON qr_scans FOR SELECT
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- site_content
-- ─────────────────────────────────────────────

-- Public can read site content (used on public marketing pages)
CREATE POLICY "site_content: public read"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "site_content: admin write"
  ON site_content FOR ALL
  USING (get_my_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────

-- Users only see their own notifications
CREATE POLICY "notifications: own read"
  ON notifications FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "notifications: own update"
  ON notifications FOR UPDATE
  USING (profile_id = auth.uid());

-- Service role / system inserts notifications
CREATE POLICY "notifications: staff insert"
  ON notifications FOR INSERT
  WITH CHECK (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- audit_logs
-- ─────────────────────────────────────────────

CREATE POLICY "audit_logs: staff read"
  ON audit_logs FOR SELECT
  USING (get_my_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- Anyone authenticated can insert audit logs (they reference themselves)
CREATE POLICY "audit_logs: insert authenticated"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────
-- appointments
-- ─────────────────────────────────────────────

CREATE POLICY "appointments: client read own"
  ON appointments FOR SELECT
  USING (
    profile_id = auth.uid()
    OR organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "appointments: staff all"
  ON appointments FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

-- ─────────────────────────────────────────────
-- AGENT TABLES — staff only (service role bypasses RLS)
-- The Railway worker uses SUPABASE_SERVICE_ROLE_KEY so it bypasses
-- all RLS automatically. These policies protect the anon/user keys.
-- ─────────────────────────────────────────────

CREATE POLICY "agent_campaigns: staff all"
  ON agent_campaigns FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_leads: staff all"
  ON agent_leads FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_email_logs: staff all"
  ON agent_email_logs FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_email_events: staff all"
  ON agent_email_events FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_audit_logs: staff all"
  ON agent_audit_logs FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_campaign_checkpoints: staff all"
  ON agent_campaign_checkpoints FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_global_unsubscribes: staff all"
  ON agent_global_unsubscribes FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_global_hard_bounces: staff all"
  ON agent_global_hard_bounces FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));

CREATE POLICY "agent_tenants: staff all"
  ON agent_tenants FOR ALL
  USING (get_my_role() IN ('ADMIN', 'MANAGER', 'SUPER_ADMIN'));
