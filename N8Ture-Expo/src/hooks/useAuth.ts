/**
 * Authentication hook utilities
 *
 * Provides convenient access to Clerk authentication state and methods
 */

import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { UserMetadata, UserProfile, DEFAULT_USER_METADATA } from '../types/user';

/**
 * Enhanced authentication hook with user metadata
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerkAuth();

  const getUserMetadata = (): UserMetadata => {
    if (!user?.publicMetadata) {
      return DEFAULT_USER_METADATA;
    }

    return {
      trialsUsed: (user.publicMetadata.trialsUsed as number) || 0,
      isPremium: (user.publicMetadata.isPremium as boolean) || false,
      subscriptionTier: (user.publicMetadata.subscriptionTier as 'free' | 'monthly' | 'annual') || 'free',
      subscriptionExpiry: user.publicMetadata.subscriptionExpiry as string | undefined,
      totalIdentifications: (user.publicMetadata.totalIdentifications as number) || 0,
      createdAt: user.publicMetadata.createdAt as string | undefined,
    };
  };

  const getUserProfile = (): UserProfile | null => {
    if (!user) return null;

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      fullName: user.fullName || undefined,
      imageUrl: user.imageUrl,
      metadata: getUserMetadata(),
    };
  };

  return {
    user,
    userProfile: getUserProfile(),
    isLoaded,
    isSignedIn: isSignedIn || false,
    signOut,
    getUserMetadata,
  };
}
