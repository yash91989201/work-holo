import { createClient } from "@supabase/supabase-js";
import { env } from "@work-holo/api/env";
import type { Database } from "@work-holo/db/lib/supabase/types";

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SECRET_KEY
);
