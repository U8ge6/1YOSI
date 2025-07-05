/*
  # Add electricity readings table

  1. New Tables
    - `electricity_readings`
      - `id` (uuid, primary key)
      - `building_id` (uuid, foreign key to buildings)
      - `entrance` (text, entrance identifier)
      - `reading_date` (text, date of reading)
      - `meter_reading` (numeric, meter reading value)
      - `notes` (text, optional notes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `electricity_readings` table
    - Add policy for authenticated users to manage readings

  3. Changes
    - Add updated_at trigger for automatic timestamp updates
*/

-- Create electricity readings table
CREATE TABLE IF NOT EXISTS electricity_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  entrance text NOT NULL,
  reading_date text NOT NULL,
  meter_reading numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE electricity_readings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can manage electricity readings"
  ON electricity_readings
  FOR ALL
  TO authenticated
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_electricity_readings_updated_at 
  BEFORE UPDATE ON electricity_readings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_electricity_readings_building_entrance 
  ON electricity_readings(building_id, entrance);

CREATE INDEX IF NOT EXISTS idx_electricity_readings_date 
  ON electricity_readings(reading_date);