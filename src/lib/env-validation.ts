/**
 * Environment validation for production
 * Ensures all required Firebase configuration is present
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
] as const;

const requiredServerEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
] as const;

export function validateEnvironment() {
  const missing: string[] = [];
  
  // Check client-side Firebase config
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  // Check server-side Firebase config (only on server)
  if (typeof window === 'undefined') {
    for (const envVar of requiredServerEnvVars) {
      if (!process.env[envVar]) {
        missing.push(envVar);
      }
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please ensure all Firebase configuration variables are set in your .env.local file.\n` +
      `See .env.example for the required format.`
    );
  }
  
  console.log('✅ Environment validation passed - Firebase configuration complete');
}

// Note: Auto-validation removed to prevent build-time failures
// Call validateEnvironment() explicitly when needed