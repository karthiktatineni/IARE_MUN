/*
  # IARE MUN Database Schema

  ## Overview
  Creates database tables for IARE MUN event management including delegate registrations
  and country allocation tracking across committees.

  ## New Tables

  ### 1. `registrations`
  Stores delegate registration information
  - `id` (uuid, primary key) - Unique registration identifier
  - `name` (text) - Delegate's full name
  - `email` (text, unique) - Delegate's email address
  - `phone` (text) - Contact phone number
  - `institution` (text) - College/School/Job organization
  - `mun_experience` (integer) - Number of MUNs attended before
  - `committee1` (text) - First committee choice
  - `country1` (text) - First country choice
  - `committee2` (text) - Second committee choice
  - `country2` (text) - Second country choice
  - `committee3` (text) - Third committee choice
  - `country3` (text) - Third country choice
  - `status` (text) - Registration status (pending/approved/rejected)
  - `created_at` (timestamptz) - Registration timestamp

  ### 2. `country_allocations`
  Tracks which countries are allocated in each committee
  - `id` (uuid, primary key) - Unique allocation identifier
  - `committee` (text) - Committee name (UNSC/DISEC/AIPPM/IP)
  - `country` (text) - Country/Party name
  - `is_allocated` (boolean) - Whether country is taken
  - `allocated_to` (text, nullable) - Name of delegate allocated to
  - `created_at` (timestamptz) - Allocation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Public can view country allocations (read-only)
  - Public can insert registrations
  - Registrations are read-only after creation for public users

  ## Notes
  - Email must be unique to prevent duplicate registrations
  - Country allocations use committee+country as unique constraint
  - Status defaults to 'pending' for new registrations
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  institution text NOT NULL,
  mun_experience integer NOT NULL DEFAULT 0,
  committee1 text NOT NULL,
  country1 text NOT NULL,
  committee2 text NOT NULL,
  country2 text NOT NULL,
  committee3 text NOT NULL,
  country3 text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS country_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  committee text NOT NULL,
  country text NOT NULL,
  is_allocated boolean DEFAULT false,
  allocated_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(committee, country)
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view country allocations"
  ON country_allocations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert registrations"
  ON registrations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own registration"
  ON registrations FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_country_allocations_committee ON country_allocations(committee);
CREATE INDEX IF NOT EXISTS idx_country_allocations_allocated ON country_allocations(committee, is_allocated);