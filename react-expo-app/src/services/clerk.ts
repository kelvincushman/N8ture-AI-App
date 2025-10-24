/**
 * Clerk authentication service configuration
 *
 * Sets up token caching with expo-secure-store for session persistence
 */

import * as SecureStore from 'expo-secure-store';
import { TokenCache } from '@clerk/clerk-expo/dist/cache';

/**
 * Token cache implementation using expo-secure-store
 * This persists authentication tokens securely on the device
 */
export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting token from secure store:', error);
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving token to secure store:', error);
    }
  },

  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error clearing token from secure store:', error);
    }
  },
};
