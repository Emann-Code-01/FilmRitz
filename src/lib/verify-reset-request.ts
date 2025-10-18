import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role key (secure)
  );

  // Check if user exists
  const { data: users, error: userError } = await supabase
    .from("auth.users")
    .select("email")
    .eq("email", email)
    .limit(1);

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!users || users.length === 0) {
    return new Response(JSON.stringify({ error: "Email not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If email exists → send reset link
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${Deno.env.get("SITE_URL")}/reset-password`, // update to your live site
  });

  if (resetError) {
    return new Response(JSON.stringify({ error: resetError.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
