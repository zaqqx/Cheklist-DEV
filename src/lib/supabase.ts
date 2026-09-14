import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Variables d'environnement manquantes : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

// Client unique réutilisé côté serveur (server actions) pour parler à Supabase via son API REST.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
