import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Faltan las variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
    'Crea un archivo .env.local con estos valores (ver README.md) y reinicia el servidor de desarrollo.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Guarda la sesion en el navegador y permite que Supabase procese
    // automaticamente tokens que vuelven desde el enlace magico.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
