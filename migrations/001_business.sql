CREATE TABLE IF NOT EXISTS lotvale_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL UNIQUE,
  name text NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  address text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS lotvale_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES lotvale_businesses(id),
  document jsonb NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lotvale_purchase_business_updated ON lotvale_purchases(business_id, updated_at DESC);
REVOKE ALL ON lotvale_businesses, lotvale_purchases FROM PUBLIC;
