/**
 * Firebase service
 *
 * Initializes Firebase and provides typed function wrappers
 */

// Note: Firebase will be installed via npm install firebase
// This is a placeholder that will work once dependencies are installed

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Placeholder for Firebase app initialization
let firebaseApp: any = null;
let functions: any = null;

/**
 * Initialize Firebase app
 * Call this in App.tsx before using Firebase services
 */
export function initializeFirebase(config: FirebaseConfig) {
  try {
    // Import Firebase dynamically to avoid errors if not installed
    const firebase = require('firebase/app');
    const { getFunctions, httpsCallable } = require('firebase/functions');

    // Initialize Firebase
    if (!firebaseApp) {
      firebaseApp = firebase.initializeApp(config);
      functions = getFunctions(firebaseApp);
      console.log('Firebase initialized successfully');
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return {
      success: false,
      error: 'Failed to initialize Firebase. Please check your configuration.',
    };
  }
}

/**
 * Get Firebase Functions instance
 */
export function getFirebaseFunctions() {
  if (!functions) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return functions;
}

/**
 * Call a Firebase Cloud Function
 */
export async function callFunction<TRequest, TResponse>(
  functionName: string,
  data: TRequest
): Promise<TResponse> {
  try {
    const { httpsCallable } = require('firebase/functions');
    const functionRef = httpsCallable(functions, functionName);
    const result = await functionRef(data);
    return result.data as TResponse;
  } catch (error: any) {
    console.error(`Error calling function ${functionName}:`, error);

    // Parse Firebase error codes
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Authentication required. Please sign in.');
    } else if (error.code === 'functions/permission-denied') {
      throw new Error('Permission denied. Please check your account status.');
    } else if (error.code === 'functions/resource-exhausted') {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.code === 'functions/deadline-exceeded') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }

    throw new Error(error.message || 'An error occurred. Please try again.');
  }
}

/**
 * Check if Firebase is initialized
 */
export function isFirebaseInitialized(): boolean {
  return firebaseApp !== null && functions !== null;
}

/**
 * Get Firebase configuration from environment
 * This should be called with actual config values from your Firebase console
 */
export function getFirebaseConfigFromEnv(): FirebaseConfig | null {
  // These should come from environment variables or secure storage
  // For now, return null to indicate configuration needed
  // TODO: Add actual configuration from .env or secure storage

  // Example structure (DO NOT commit actual values):
  // return {
  //   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  //   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  //   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  //   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  //   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  //   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  // };

  return null;
}
