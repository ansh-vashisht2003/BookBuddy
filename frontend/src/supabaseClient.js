import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykctdytesjklaylfftkj.supabase.co'; // replace this
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY3RkeXRlc2prbGF5bGZmdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTYwODMsImV4cCI6MjA2NDY3MjA4M30.AyyTlBv6BBJ8zXl9iWzQQdp3O0emHPx7j2d00JbOnjI'; // replace this

export const supabase = createClient(supabaseUrl, supabaseKey);

