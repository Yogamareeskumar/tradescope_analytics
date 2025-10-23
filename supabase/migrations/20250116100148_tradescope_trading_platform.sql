-- Location: supabase/migrations/20250116100148_tradescope_trading_platform.sql
-- Schema Analysis: Existing schema with trades and users tables - extending for trading platform
-- Integration Type: Schema-aware migration that respects existing structure
-- Dependencies: Works with existing trades (text id) and users (integer id) tables

-- 1. Types and Enums - Create if not exists
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('trader', 'admin', 'analyst');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.trade_status AS ENUM ('open', 'closed', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.trade_type AS ENUM ('buy', 'sell');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.order_type AS ENUM ('market', 'limit', 'stop', 'stop_limit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.position_side AS ENUM ('long', 'short');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.broker_status AS ENUM ('active', 'inactive', 'error', 'syncing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.currency_code AS ENUM ('USD', 'INR', 'EUR', 'GBP', 'JPY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. User Profiles - Bridge table between auth.users and existing users table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES public.users(user_id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'trader'::public.user_role,
    preferred_currency public.currency_code DEFAULT 'USD'::public.currency_code,
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 3. Trading Platform Tables - Compatible with existing structure
CREATE TABLE IF NOT EXISTS public.brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    api_key TEXT,
    api_secret TEXT,
    account_id TEXT,
    status public.broker_status DEFAULT 'inactive'::public.broker_status,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.trading_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE,
    account_name TEXT NOT NULL,
    account_number TEXT,
    balance DECIMAL(15,2) DEFAULT 0,
    currency public.currency_code DEFAULT 'USD'::public.currency_code,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders table - Compatible with existing trades table (text id)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    trade_id TEXT REFERENCES public.trades(id) ON DELETE CASCADE, -- TEXT to match existing trades.id
    symbol TEXT NOT NULL,
    order_type public.order_type NOT NULL,
    quantity DECIMAL(15,6) NOT NULL,
    price DECIMAL(15,6),
    status TEXT DEFAULT 'pending',
    filled_quantity DECIMAL(15,6) DEFAULT 0,
    filled_price DECIMAL(15,6),
    order_id_external TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    total_value DECIMAL(15,2) DEFAULT 0,
    total_pnl DECIMAL(15,2) DEFAULT 0,
    total_pnl_percentage DECIMAL(8,4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    parameters JSONB,
    win_rate DECIMAL(5,2),
    avg_profit DECIMAL(15,2),
    avg_loss DECIMAL(15,2),
    total_trades INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.analytics_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    daily_pnl DECIMAL(15,2) DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    largest_win DECIMAL(15,2) DEFAULT 0,
    largest_loss DECIMAL(15,2) DEFAULT 0,
    volume_traded DECIMAL(15,6) DEFAULT 0,
    commission_paid DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Essential Indexes - Create if not exists
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_brokers_user_profile_id ON public.brokers(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_trading_accounts_user_profile_id ON public.trading_accounts(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_profile_id ON public.orders(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_trade_id ON public.orders(trade_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_profile_id ON public.portfolios(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_strategies_user_profile_id ON public.strategies(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_user_profile_id ON public.analytics_data(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_date ON public.analytics_data(date);

-- 6. Functions - Create or replace (safe for existing functions)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if user_profiles already exists for this user
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = NEW.id) THEN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'trader')::public.user_role
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 7. Enable RLS - Safe to run multiple times
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies - Drop existing and recreate to avoid conflicts
DO $$ BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
    DROP POLICY IF EXISTS "users_manage_own_brokers" ON public.brokers;
    DROP POLICY IF EXISTS "users_manage_own_trading_accounts" ON public.trading_accounts;
    DROP POLICY IF EXISTS "users_manage_own_orders" ON public.orders;
    DROP POLICY IF EXISTS "users_manage_own_portfolios" ON public.portfolios;
    DROP POLICY IF EXISTS "users_manage_own_strategies" ON public.strategies;
    DROP POLICY IF EXISTS "users_manage_own_analytics_data" ON public.analytics_data;
END $$;

-- Create new policies
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "users_manage_own_brokers"
ON public.brokers
FOR ALL
TO authenticated
USING (user_profile_id = auth.uid())
WITH CHECK (user_profile_id = auth.uid());

CREATE POLICY "users_manage_own_trading_accounts"
ON public.trading_accounts
FOR ALL
TO authenticated
USING (user_profile_id = auth.uid())
WITH CHECK (user_profile_id = auth.uid());

CREATE POLICY "users_manage_own_orders"
ON public.orders
FOR ALL
TO authenticated
USING (user_profile_id = auth.uid())
WITH CHECK (user_profile_id = auth.uid());

CREATE POLICY "users_manage_own_portfolios"
ON public.portfolios
FOR ALL
TO authenticated
USING (user_profile_id = auth.uid())
WITH CHECK (user_profile_id = auth.uid());

CREATE POLICY "users_manage_own_strategies"
ON public.strategies
FOR ALL
TO authenticated
USING (user_profile_id = auth.uid())
WITH CHECK (user_profile_id = auth.uid());

CREATE POLICY "users_manage_own_analytics_data"
ON public.analytics_data
FOR ALL
TO authenticated
USING (user_profile_id = auth.uid())
WITH CHECK (user_profile_id = auth.uid());

-- 9. Triggers - Drop existing and recreate to avoid conflicts
DO $$ BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
    DROP TRIGGER IF EXISTS update_brokers_updated_at ON public.brokers;
    DROP TRIGGER IF EXISTS update_trading_accounts_updated_at ON public.trading_accounts;
    DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
END $$;

-- Create new triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brokers_updated_at
  BEFORE UPDATE ON public.brokers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trading_accounts_updated_at
  BEFORE UPDATE ON public.trading_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Mock Data for Testing - Only insert if data doesn't exist
DO $$
DECLARE
    trader_uuid UUID := '550e8400-e29b-41d4-a716-446655440000';
    admin_uuid UUID := '550e8400-e29b-41d4-a716-446655440001';
    existing_user_id INTEGER;
    broker_id UUID := gen_random_uuid();
    account_id UUID := gen_random_uuid();
    user_exists INTEGER;
BEGIN
    -- Check if test users already exist
    SELECT COUNT(*) INTO user_exists FROM auth.users WHERE email = 'trader@tradescope.com';
    
    IF user_exists = 0 THEN
        -- Get an existing user_id from users table for linking
        SELECT user_id INTO existing_user_id FROM public.users LIMIT 1;
        
        -- Create auth users with required fields
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous
        ) VALUES
            (trader_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
             'trader@tradescope.com', crypt('TradeScope2024!', gen_salt('bf', 10)), now(), now(), now(),
             '{"full_name": "Alex Thompson", "role": "trader"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
             false, false),
            (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
             'admin@tradescope.com', crypt('Admin2024!', gen_salt('bf', 10)), now(), now(), now(),
             '{"full_name": "Sarah Johnson", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
             false, false);

        -- Link with existing users table if exists
        IF existing_user_id IS NOT NULL THEN
            UPDATE public.user_profiles 
            SET user_id = existing_user_id 
            WHERE id = trader_uuid;
        END IF;

        -- Create sample trading platform data
        INSERT INTO public.brokers (id, user_profile_id, name, status) VALUES
            (broker_id, trader_uuid, 'Zerodha', 'active'::public.broker_status);

        INSERT INTO public.trading_accounts (id, user_profile_id, broker_id, account_name, balance) VALUES
            (account_id, trader_uuid, broker_id, 'Main Trading Account', 50000.00);

        INSERT INTO public.portfolios (user_profile_id, name, total_value, total_pnl)
        VALUES (trader_uuid, 'Main Portfolio', 51500.00, 1500.00);

        INSERT INTO public.strategies (user_profile_id, name, description, win_rate, total_trades)
        VALUES (trader_uuid, 'Momentum Trading', 'Buy stocks showing strong momentum', 65.5, 50);

        INSERT INTO public.analytics_data (user_profile_id, date, daily_pnl, total_trades, winning_trades, losing_trades)
        VALUES 
            (trader_uuid, CURRENT_DATE - INTERVAL '1 day', 500.00, 2, 1, 1),
            (trader_uuid, CURRENT_DATE, 250.00, 1, 1, 0);
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in mock data creation: %', SQLERRM;
END $$;