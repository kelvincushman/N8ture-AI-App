/**
 * Environment configuration
 *
 * Access environment variables in a type-safe way.
 * All public variables must be prefixed with EXPO_PUBLIC_
 */

export const env = {
  // Clerk Authentication
  clerk: {
    publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  },

  // Firebase Configuration
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  },

  // App Configuration
  app: {
    env: process.env.EXPO_PUBLIC_APP_ENV || 'development',
    apiUrl: process.env.EXPO_PUBLIC_API_URL || '',
  },
} as const;

// Validate required environment variables
export function validateEnv() {
  const errors: string[] = [];

  if (!env.clerk.publishableKey) {
    errors.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required');
  }

  if (!env.firebase.apiKey) {
    errors.push('EXPO_PUBLIC_FIREBASE_API_KEY is required');
  }

  if (!env.firebase.projectId) {
    errors.push('EXPO_PUBLIC_FIREBASE_PROJECT_ID is required');
  }

  if (errors.length > 0) {
    console.warn(
      'Environment configuration warnings:\n' + errors.map((e) => `  - ${e}`).join('\n')
    );
  }

  return errors.length === 0;
}
