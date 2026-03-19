-- ============================================================
-- SubFlow — Initial Schema Migration
-- Supabase PostgreSQL with RLS
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  amount              DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency            TEXT NOT NULL DEFAULT 'USD',
  billing_cycle       TEXT NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly')),
  start_date          DATE NOT NULL,
  next_billing_date   DATE NOT NULL,
  category            TEXT,
  logo_url            TEXT,
  website_url         TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  card_id             UUID REFERENCES cards(id) ON DELETE SET NULL,
  reminder_days       INTEGER NOT NULL DEFAULT 3 CHECK (reminder_days BETWEEN 0 AND 30),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cards (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  last_four_digits   TEXT,
  brand              TEXT CHECK (brand IN ('visa', 'mastercard', 'amex', 'discover', 'other')),
  type               TEXT CHECK (type IN ('credit', 'debit')),
  expiry_month       INTEGER CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year        INTEGER CHECK (expiry_year >= EXTRACT(YEAR FROM now())),
  color              TEXT,
  is_default         BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id     UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  type                TEXT NOT NULL CHECK (type IN ('email', 'push', 'sms')),
  trigger_days_before INTEGER NOT NULL DEFAULT 3,
  is_enabled          BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period             DATE NOT NULL,
  total_spent        DECIMAL(10,2) NOT NULL DEFAULT 0,
  subscription_count INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, period)
);

-- ============================================================
-- 2. AUTO-UPDATE updated_at TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Subscriptions
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_insert_own" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_update_own" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_delete_own" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Cards
CREATE POLICY "cards_select_own" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cards_insert_own" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cards_update_own" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cards_delete_own" ON cards
  FOR DELETE USING (auth.uid() = user_id);

-- Alerts
CREATE POLICY "alerts_select_own" ON alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "alerts_insert_own" ON alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "alerts_update_own" ON alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "alerts_delete_own" ON alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics (read-only for users)
CREATE POLICY "analytics_select_own" ON analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "analytics_insert_own" ON analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 4. PERFORMANCE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id       ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing  ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_active   ON subscriptions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_category  ON subscriptions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_cards_user_default          ON cards(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_alerts_subscription         ON alerts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_enabled         ON alerts(user_id, is_enabled);
CREATE INDEX IF NOT EXISTS idx_analytics_user_period       ON analytics(user_id, period DESC);

-- ============================================================
-- 5. REALTIME (optional - enable if needed)
-- ============================================================

-- ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE cards;
