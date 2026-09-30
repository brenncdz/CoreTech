import { createClient } from '@supabase/supabase-js'

const projectRef = "zazwmmveergrnriuhann";
const supabaseUrl = `https://${projectRef}.supabase.co`;
const supabaseApiKey = "sb_publishable_T89K9Qp4Cavh9rCma6LjjQ_9FphvF8e";

export const supabase = createClient(supabaseUrl, supabaseApiKey);