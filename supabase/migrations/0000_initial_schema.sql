-- supabase/migrations/0000_initial_schema.sql
-- Creado por: agency-database-optimizer

-- ----------------------------------------------------------------------------
-- 1. TIPOS ENUM (Para mayor seguridad y estricticidad)
-- ----------------------------------------------------------------------------
CREATE TYPE billing_cycle AS ENUM ('weekly', 'monthly', 'yearly');
CREATE TYPE card_brand AS ENUM ('visa', 'mastercard', 'amex', 'discover', 'other');
CREATE TYPE card_type AS ENUM ('credit', 'debit');
CREATE TYPE notification_type AS ENUM ('email', 'push', 'sms');

-- ----------------------------------------------------------------------------
-- 2. RUTINA PARA AUTO-ACTUALIZAR `updated_at`
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ----------------------------------------------------------------------------
-- 3. TABLA: users (Perfil público sincronizado con auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: auto update auth.users -> public.users automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. TABLA: cards
-- ----------------------------------------------------------------------------
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  last_four_digits VARCHAR(4),
  brand card_brand,
  type card_type,
  expiry_month INTEGER CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year INTEGER CHECK (expiry_year >= EXTRACT(YEAR FROM now())),
  color TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. TABLA: subscriptions
-- ----------------------------------------------------------------------------
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  billing_cycle billing_cycle NOT NULL,
  start_date DATE NOT NULL,
  next_billing_date DATE NOT NULL,
  category TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
  reminder_days INTEGER NOT NULL DEFAULT 3 CHECK (reminder_days BETWEEN 0 AND 30),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. TABLA: notifications (Sustituye a alerts según documentación)
-- ----------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  trigger_days_before INTEGER NOT NULL DEFAULT 3,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7. TRIGGERS `updated_at` (Aplicación)
-- ----------------------------------------------------------------------------
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) - "Never Trust Application Code"
-- ----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 8.1 Users Policies
CREATE POLICY "Users can view own profile." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 8.2 Cards Policies
CREATE POLICY "Users can view own cards." ON public.cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards." ON public.cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards." ON public.cards FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards." ON public.cards FOR DELETE USING (auth.uid() = user_id);

-- 8.3 Subscriptions Policies
CREATE POLICY "Users can view own subscriptions." ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions." ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions." ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions." ON public.subscriptions FOR DELETE USING (auth.uid() = user_id);

-- 8.4 Notifications Policies
CREATE POLICY "Users can view own notifications." ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications." ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications." ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications." ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 9. ÍNDICES DE RENDIMIENTO (Performance Indexes para queries críticas)
-- ----------------------------------------------------------------------------
-- Users
CREATE INDEX idx_users_email ON public.users(email);

-- Cards
CREATE INDEX idx_cards_user_default ON public.cards(user_id) WHERE is_default = true;
CREATE INDEX idx_cards_user_id ON public.cards(user_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
-- Fast scan for chron jobs looking for active subscriptions near billing date
CREATE INDEX idx_subscriptions_next_billing ON public.subscriptions(next_billing_date) WHERE is_active = true;
CREATE INDEX idx_subscriptions_card_id ON public.subscriptions(card_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_subscription_id ON public.notifications(subscription_id);
-- Fast scan for active notification rules
CREATE INDEX idx_notifications_enabled ON public.notifications(is_enabled) WHERE is_enabled = true;
