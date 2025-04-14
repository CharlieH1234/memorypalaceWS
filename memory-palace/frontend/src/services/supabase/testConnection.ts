import { supabase } from './config';

async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      console.error('Connection test failed:', error.message);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

export { testSupabaseConnection };
