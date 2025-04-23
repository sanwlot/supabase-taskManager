import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://dlelryosoaecjurswsjo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZWxyeW9zb2FlY2p1cnN3c2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTI3NDUsImV4cCI6MjA2MDg4ODc0NX0.vEiZaYJlQPB0NGgua_gtqLrTIoE-fnUzHZjdpNApdnw'
)
