import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmajyriqfpbtzigxuvca.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYWp5cmlxZnBidHppZ3h1dmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjI4NzUsImV4cCI6MjA2NTgzODg3NX0.V00WUMZgheCbrk3tCtCskg1fcOaqTYTbFI0XJ6n9InU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 