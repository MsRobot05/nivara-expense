
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL in the server .env file");
}

// This client uses the publishable/anon key and respects RLS.
// Do not put a service-role or secret key in the frontend.
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error("Missing SUPABASE_ANON_KEY in the server .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
