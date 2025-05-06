import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;


// Custom fetch with ngrok-skip-browser-warning header, to support testing on other devices e.g. phone during local development
const customFetch = (url: RequestInfo | URL, options: RequestInit = {}) => {
    // Create a new Headers instance, copying existing headers
    const headers = new Headers(options.headers || {});
  
    // Add the ngrok-skip-browser-warning header
    headers.append('ngrok-skip-browser-warning', 'true');
  
    // Create modified options with the updated headers
    const modifiedOptions = {
      ...options,
      headers,
    };
  
    return fetch(url, modifiedOptions);
  };

// Initialize Supabase with the custom fetch
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
  },
});