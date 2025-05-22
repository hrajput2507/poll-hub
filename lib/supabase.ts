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
//     fetch: (url: RequestInfo | URL, init?: RequestInit) => {
//       return fetch(url, {
//         ...init,
//         credentials: "include",
//       });
//     },
//   },
//   db: {
//     schema: "public",
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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      apikey: supabaseAnonKey, // Ensure API key is included
    },
    fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await fetch(url, {
          ...init,
          credentials: "include", // Only if explicitly needed
          headers: {
            ...init?.headers,
            apikey: supabaseAnonKey,
          },
        });

        // Handle CORS/preflight issues
        if (!response.ok && response.status === 0) {
          throw new Error(`CORS error when accessing ${url}`);
        }

        return response;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
  },
  db: {
    schema: "public",
  },
});
