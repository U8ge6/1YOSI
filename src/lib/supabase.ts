import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values for development with valid Supabase URL format
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using placeholder values. Please configure Supabase connection.');
}

// Only create the client if we have valid configuration
let supabase: ReturnType<typeof createClient<Database>>;

try {
  const urlToUse = supabaseUrl || defaultUrl;
  const keyToUse = supabaseAnonKey || defaultKey;
  
  // Validate URL format before creating client
  new URL(urlToUse);
  
  supabase = createClient<Database>(urlToUse, keyToUse);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a mock client that won't cause errors
  supabase = createClient<Database>(
    'https://mock.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTE5MjgwMCwiZXhwIjoxOTYwNzY4ODAwfQ.mock'
  );
}

export { supabase };

export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== defaultUrl && 
         supabaseAnonKey !== defaultKey;
};