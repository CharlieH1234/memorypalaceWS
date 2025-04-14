import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function to verify database connection
export const testConnection = async () => {
  try {
    const { error } = await supabase.from('_test_connection').select('*').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};
