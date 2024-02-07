// supabaseConfig.js
const supabase = require('@supabase/supabase-js');
const supabaseUrl = 'https://bgynecsgqrdfrkcyshsz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneW5lY3NncXJkZnJrY3lzaHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNzYxOTQsImV4cCI6MjAyMjg1MjE5NH0.-0gp9bF5zNXjHLp_WNDYSofyMr334kWZXSP3Aslg1tw';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabaseUrl, supabaseAnonKey, supabaseClient };
