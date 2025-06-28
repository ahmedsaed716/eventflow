// src/utils/debugService.js
import supabase from './supabase';
import authService from './authService';

class DebugService {
  constructor() {
    this.isDebugMode = import.meta.env.MODE === 'development';
  }

  // Check if debug mode is enabled
  isEnabled() {
    return this.isDebugMode;
  }

  // Test all demo credentials
  async testAllDemoCredentials() {
    if (!this.isDebugMode) {
      return { success: false, error: 'Debug mode not enabled' };
    }

    const demoCredentials = [
      { email: 'admin@eventflow.com', password: 'admin123', role: 'Admin' },
      { email: 'manager@eventflow.com', password: 'manager123', role: 'Manager' },
      { email: 'usher@eventflow.com', password: 'usher123', role: 'Usher' },
      { email: 'attendee@eventflow.com', password: 'attendee123', role: 'Attendee' }
    ];

    const results = [];

    for (const cred of demoCredentials) {
      try {
        console.log(`Testing ${cred.role} credentials...`);
        
        // Test the credentials
        const result = await authService.signIn(cred.email, cred.password);
        
        // Sign out after test
        if (result.success) {
          await authService.signOut();
        }

        results.push({
          role: cred.role,
          email: cred.email,
          success: result.success,
          error: result.error,
          code: result.code
        });
      } catch (error) {
        results.push({
          role: cred.role,
          email: cred.email,
          success: false,
          error: error.message,
          code: 'TEST_ERROR'
        });
      }
    }

    return { success: true, data: results };
  }

  // Verify Supabase setup
  async verifySupabaseSetup() {
    if (!this.isDebugMode) {
      return { success: false, error: 'Debug mode not enabled' };
    }

    try {
      // Check if we can connect to Supabase
      const { data, error } = await supabase.rpc('verify_auth_setup');
      
      if (error) {
        return { success: false, error: error.message, code: 'RPC_ERROR' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, code: 'CONNECTION_ERROR' };
    }
  }

  // Get environment configuration status
  getEnvStatus() {
    if (!this.isDebugMode) {
      return { success: false, error: 'Debug mode not enabled' };
    }

    const envVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV
    };

    const status = {
      hasSupabaseUrl: !!envVars.VITE_SUPABASE_URL,
      hasSupabaseKey: !!envVars.VITE_SUPABASE_ANON_KEY,
      isDevelopment: envVars.MODE === 'development',
      supabaseUrlFormat: envVars.VITE_SUPABASE_URL?.startsWith('https://') ? 'valid' : 'invalid',
      supabaseKeyLength: envVars.VITE_SUPABASE_ANON_KEY?.length || 0
    };

    return { 
      success: true, 
      data: { 
        envVars: {
          ...envVars,
          VITE_SUPABASE_ANON_KEY: envVars.VITE_SUPABASE_ANON_KEY ? 
            `${envVars.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'missing'
        },
        status 
      } 
    };
  }

  // Check user table data
  async checkUserData() {
    if (!this.isDebugMode) {
      return { success: false, error: 'Debug mode not enabled' };
    }

    try {
      // Count auth users
      const { count: authCount, error: authError } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })
        .filter('email', 'like', '%@eventflow.com');

      // Count user profiles
      const { count: profileCount, error: profileError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .filter('email', 'like', '%@eventflow.com');

      // Get sample profiles
      const { data: profiles, error: profileDataError } = await supabase
        .from('user_profiles')
        .select('email, role, is_active, created_at')
        .filter('email', 'like', '%@eventflow.com')
        .limit(10);

      return {
        success: true,
        data: {
          authUsersCount: authCount || 0,
          profilesCount: profileCount || 0,
          sampleProfiles: profiles || [],
          errors: {
            authError: authError?.message,
            profileError: profileError?.message,
            profileDataError: profileDataError?.message
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message, code: 'QUERY_ERROR' };
    }
  }

  // Generate troubleshooting report
  async generateTroubleshootingReport() {
    if (!this.isDebugMode) {
      return { success: false, error: 'Debug mode not enabled' };
    }

    console.log('🔍 Generating Troubleshooting Report...');

    const report = {
      timestamp: new Date().toISOString(),
      sections: {}
    };

    // Environment status
    const envStatus = this.getEnvStatus();
    report.sections.environment = envStatus;

    // Supabase setup verification
    const setupVerification = await this.verifySupabaseSetup();
    report.sections.supabaseSetup = setupVerification;

    // User data check
    const userData = await this.checkUserData();
    report.sections.userData = userData;

    // Demo credentials test
    const credentialsTest = await this.testAllDemoCredentials();
    report.sections.credentialsTest = credentialsTest;

    console.log('📊 Troubleshooting Report Generated:', report);
    return { success: true, data: report };
  }

  // Quick fix suggestions based on common issues
  getQuickFixSuggestions() {
    if (!this.isDebugMode) {
      return { success: false, error: 'Debug mode not enabled' };
    }

    const suggestions = [
      {
        issue: 'Invalid email or password',
        checks: [
          'Verify demo credentials are correctly set up in database',
          'Check if user_profiles table has corresponding entries',
          'Ensure Supabase project is not paused',
          'Verify environment variables are correctly configured'
        ],
        fixes: [
          'Run database migration to create demo users',
          'Check browser network tab for failed requests',
          'Try different demo credentials',
          'Clear browser cache and cookies'
        ]
      },
      {
        issue: 'Connection timeout',
        checks: [
          'Check internet connection',
          'Verify Supabase project status',
          'Check for firewall blocking'
        ],
        fixes: [
          'Try refreshing the page',
          'Switch to different network',
          'Contact Supabase support if persistent'
        ]
      },
      {
        issue: 'Configuration error',
        checks: [
          'Verify .env file exists and has correct values',
          'Check environment variable names',
          'Ensure Supabase URL format is correct'
        ],
        fixes: [
          'Update .env file with correct Supabase credentials',
          'Restart development server',
          'Copy fresh credentials from Supabase dashboard'
        ]
      }
    ];

    return { success: true, data: suggestions };
  }
}

export default new DebugService();