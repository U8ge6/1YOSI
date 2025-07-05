/*
  # Create building management system tables

  1. New Tables
    - `buildings` - Building information
    - `tenants` - Tenant information per building
    - `payments` - Payment tracking
    - `expenses` - Building expenses
    - `petty_cash` - Petty cash transactions
    - `employees` - Employee management
    - `issues` - Issue tracking
    - `products` - Inventory products
    - `product_usages` - Product usage tracking
    - `product_history` - Product history
    - `app_settings` - Application settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  entrances text[] NOT NULL DEFAULT '{}',
  elevator_company text,
  elevator_phone text,
  electricity_details jsonb,
  entrance_codes jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  apartment text NOT NULL,
  floor integer NOT NULL DEFAULT 1,
  name text NOT NULL,
  ownership_status text NOT NULL CHECK (ownership_status IN ('owner', 'renter')),
  owner_name text,
  owner_phone text,
  entrance text NOT NULL,
  primary_phone text NOT NULL,
  secondary_phone text,
  monthly_amount integer NOT NULL DEFAULT 450,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'credit')),
  credit_day integer,
  custom_amount integer,
  is_debtor boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  paid boolean DEFAULT false,
  date text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, month, year)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  date text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  notes text,
  is_auto_generated boolean DEFAULT false,
  source_type text,
  source_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Petty cash table
CREATE TABLE IF NOT EXISTS petty_cash (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  date text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL DEFAULT 0,
  is_auto_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  start_date text NOT NULL,
  base_salary numeric NOT NULL DEFAULT 0,
  work_days_per_month numeric NOT NULL DEFAULT 21.67,
  absences jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  date text NOT NULL,
  reporter_name text NOT NULL,
  description text NOT NULL,
  repair_cost numeric,
  status text NOT NULL CHECK (status IN ('open', 'in-progress', 'resolved')) DEFAULT 'open',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  price_per_unit numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product usages table
CREATE TABLE IF NOT EXISTS product_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  location text NOT NULL,
  date text NOT NULL,
  notes text,
  cost numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product history table
CREATE TABLE IF NOT EXISTS product_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  date text NOT NULL,
  action text NOT NULL CHECK (action IN ('add', 'use', 'create')),
  quantity integer NOT NULL,
  location text,
  cost numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_title text NOT NULL DEFAULT 'ניהול בניין משותף',
  tab_order text[] NOT NULL DEFAULT '{}',
  monthly_amounts jsonb DEFAULT '{}',
  petty_cash_transfers jsonb DEFAULT '{}',
  whatsapp_template text NOT NULL DEFAULT 'שלום {שם}, אנא שלם את דמי הבית עבור {חודשים}. סה"כ לתשלום: {סכום_כולל}₪. תודה!',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE petty_cash ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can manage buildings"
  ON buildings
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage tenants"
  ON tenants
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage petty cash"
  ON petty_cash
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage issues"
  ON issues
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage product usages"
  ON product_usages
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage product history"
  ON product_history
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage app settings"
  ON app_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_petty_cash_updated_at BEFORE UPDATE ON petty_cash FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_usages_updated_at BEFORE UPDATE ON product_usages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_history_updated_at BEFORE UPDATE ON product_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();