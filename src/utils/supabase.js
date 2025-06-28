// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation with detailed error messages
const validateSupabaseConfig = () => {
  const errors = [];
  
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is missing from environment variables');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must be a valid HTTPS URL (e.g., https://your-project.supabase.co)');
  }
  
  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is missing from environment variables');
  } else if (supabaseAnonKey.length < 100) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)');
  }
  
  if (errors.length > 0) {
    const errorMessage = `
Supabase Configuration Error:
${errors.map(error => `- ${error}`).join('\n')}

Please check your .env file and ensure it contains:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

If you don't have these values:
1. Go to https://supabase.com/dashboard
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the URL and anon/public key
    `;
    throw new Error(errorMessage);
  }
};

// Validate configuration before creating client
validateSupabaseConfig();

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // Add retry logic for network issues
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Enhanced connection testing with retry logic
export const testSupabaseConnection = async (retries = 3) => {
  let lastError = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      // Test basic connectivity first
      if (!navigator.onLine) {
        throw new Error('No internet connection detected');
      }

      // Try to reach Supabase URL
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Supabase server responded with status ${response.status}`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Connection timeout - Supabase server is not responding');
        }
        throw fetchError;
      }

      // Test auth endpoint specifically
      const { data, error } = await supabase.auth.getSession();
      if (error && error.message !== 'session_not_found') {
        throw error;
      }
      
      return { 
        success: true, 
        message: 'Supabase connection successful',
        attempt: i + 1
      };
    } catch (error) {
      lastError = error;
      console.warn(`Supabase connection attempt ${i + 1} failed:`, error.message);
      
      // Wait before retry (exponential backoff)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  console.error('All Supabase connection attempts failed:', lastError);
  
  // Provide specific error messages based on error type
  let errorMessage = lastError?.message || 'Unknown connection error';
  let suggestion = 'Check your internet connection and Supabase configuration';
  
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
    errorMessage = 'Unable to connect to authentication service. This could be due to network issues or CORS configuration.';
    suggestion = 'Check your internet connection. If the problem persists, the Supabase project may be paused or have incorrect CORS settings.';
  } else if (errorMessage.includes('timeout')) {
    errorMessage = 'Connection timeout - the authentication service is not responding.';
    suggestion = 'Try again in a few moments. If the problem persists, check if your Supabase project is active.';
  } else if (errorMessage.includes('No internet connection')) {
    errorMessage = 'No internet connection detected.';
    suggestion = 'Check your internet connection and try again.';
  }
  
  return { 
    success: false, 
    error: errorMessage,
    suggestion,
    retries: retries
  };
};

// Check if running in development mode
export const isDevelopmentMode = () => {
  return import.meta.env.MODE === 'development';
};

// Network status checker
export const checkNetworkStatus = () => {
  return {
    online: navigator.onLine,
    connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
    userAgent: navigator.userAgent
  };
};

export default supabase;