/**
 * User type definitions for N8ture AI app
 */

export type SubscriptionTier = 'free' | 'monthly' | 'annual';

export interface UserMetadata {
  trialsUsed: number;           // 0-3
  isPremium: boolean;           // Premium subscription status
  subscriptionTier: SubscriptionTier; // 'free' | 'monthly' | 'annual'
  subscriptionExpiry?: string;  // ISO date
  totalIdentifications: number; // Total count
  createdAt?: string;           // ISO date
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  imageUrl?: string;
  metadata: UserMetadata;
}

export const DEFAULT_USER_METADATA: UserMetadata = {
  trialsUsed: 0,
  isPremium: false,
  subscriptionTier: 'free',
  totalIdentifications: 0,
  createdAt: new Date().toISOString(),
};

export const MAX_FREE_TRIALS = 3;
