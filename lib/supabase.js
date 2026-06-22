import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bpheduwxecvitspiryut.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaGVkdXd4ZWN2aXRzcGlyeXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwOTkyNTMsImV4cCI6MjA5NzY3NTI1M30.GqWdK7Qi9NkO4ERUFbz2n5r7QwNV7ReAmrAMqKhHQ4o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);