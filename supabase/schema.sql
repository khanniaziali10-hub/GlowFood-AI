-- GlowFood AI – Supabase / PostgreSQL Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pantry Items table
CREATE TABLE IF NOT EXISTS pantry_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'Other',
  quantity      NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit          TEXT NOT NULL DEFAULT 'pcs',
  expiry_date   DATE NOT NULL,
  added_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  barcode       TEXT,
  notes         TEXT,
  emoji         TEXT DEFAULT '🥫',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pantry_items_updated_at
  BEFORE UPDATE ON pantry_items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Index for fast expiry queries
CREATE INDEX idx_pantry_expiry ON pantry_items(expiry_date ASC);
CREATE INDEX idx_pantry_category ON pantry_items(category);

-- Row Level Security (enable after adding auth)
-- ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users manage their own items" ON pantry_items
--   USING (auth.uid() = user_id);

-- Sample seed data (optional)
INSERT INTO pantry_items (name, category, quantity, unit, expiry_date, emoji) VALUES
  ('Whole Milk',     'Dairy',           1,   'L',    CURRENT_DATE + INTERVAL '2 days',  '🥛'),
  ('Greek Yogurt',   'Dairy',           2,   'pcs',  CURRENT_DATE + INTERVAL '1 day',   '🫙'),
  ('Spinach',        'Produce',         1,   'bag',  CURRENT_DATE + INTERVAL '3 days',  '🥬'),
  ('Chicken Breast', 'Meat & Seafood',  500, 'g',    CURRENT_DATE + INTERVAL '1 day',   '🍗'),
  ('Avocados',       'Produce',         3,   'pcs',  CURRENT_DATE + INTERVAL '4 days',  '🥑'),
  ('Mixed Berries',  'Produce',         1,   'pack', CURRENT_DATE + INTERVAL '2 days',  '🍓'),
  ('Cheddar Cheese', 'Dairy',           200, 'g',    CURRENT_DATE + INTERVAL '10 days', '🧀'),
  ('Sourdough Bread','Grains & Bread',  1,   'loaf', CURRENT_DATE + INTERVAL '5 days',  '🍞'),
  ('Eggs',           'Dairy',           12,  'pcs',  CURRENT_DATE + INTERVAL '14 days', '🥚'),
  ('Salmon Fillet',  'Meat & Seafood',  300, 'g',    CURRENT_DATE + INTERVAL '1 day',   '🐟');
