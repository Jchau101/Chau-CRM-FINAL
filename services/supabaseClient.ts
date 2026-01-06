import { createClient } from '@supabase/supabase-js';

// For now, hard-code Supabase config so you don't have to worry about .env setup.
// You can move these into Vite env vars later if you want.
const supabaseUrl = 'https://lstjyiqpedklcinidtto.supabase.co';
const supabaseAnonKey = 'sb_publishable_Yao0Fihw0Pf_oXlOzUUOIw_gzmPjakB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

