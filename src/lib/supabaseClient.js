import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nsvnbaypvgehxepmhwjb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdm5iYXlwdmdlaHhlcG1od2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzOTg5NzAsImV4cCI6MjA2ODk3NDk3MH0.WMsGmHO3d9wCBaVTLjCjLSVi_fcAbdbRCMqjRHZLgik'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)