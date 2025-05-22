import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true,
//   },
//   global: {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   },
//   db: {
//     schema: "public",
//   },
//   fetch: (url: RequestInfo | URL, init: RequestInit | undefined) => {
//     return fetch(url, {
//       ...init,
//       credentials: "include",
//     });
//   },
// });
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "Content-Type": "application/json",
    },
    fetch: (url: RequestInfo | URL, init?: RequestInit) => {
      return fetch(url, {
        ...init,
        credentials: "same-origin", // Safer than 'include'
      });
    },
  },
  db: {
    schema: "public",
  },
});
