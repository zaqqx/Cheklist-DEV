import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Variables d'environnement manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY"
  );
}

// Cette clé reste côté serveur et permet aux actions protégées par NextAuth de traverser les RLS.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
