import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "🚨 Supabase Configuration Error\n\n" +
      "Missing required environment variables:\n" +
      `- VITE_SUPABASE_URL: ${supabaseUrl ? "✓" : "✗ MISSING"}\n` +
      `- VITE_SUPABASE_ANON_KEY: ${supabaseKey ? "✓" : "✗ MISSING"}\n\n` +
      "Please create a .env file in the root directory with:\n" +
      "VITE_SUPABASE_URL=your-project-url\n" +
      "VITE_SUPABASE_ANON_KEY=your-anon-key"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
