
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aciykgfeiaympjtpookm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaXlrZ2ZlaWF5bXBqdHBvb2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzQ4NDYsImV4cCI6MjA2MDc1MDg0Nn0.43M0yqdqBdY61Pd3SzPRjIXPb7VUhV6SM1LH13eV4MM';

export const supabase = createClient(supabaseUrl, supabaseKey);
