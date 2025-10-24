/**
 * Trial management hooks
 *
 * Manages free trial tracking and premium subscription checks
 */

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { MAX_FREE_TRIALS } from '../types/user';

/**
 * Hook to check and manage trial status
 */
export function useTrialStatus() {
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const getTrialsUsed = useCallback((): number => {
    return (user?.publicMetadata?.trialsUsed as number) || 0;
  }, [user]);

  const getRemainingTrials = useCallback((): number => {
    const used = getTrialsUsed();
    return Math.max(0, MAX_FREE_TRIALS - used);
  }, [getTrialsUsed]);

  const hasTrialsRemaining = useCallback((): boolean => {
    return getRemainingTrials() > 0;
  }, [getRemainingTrials]);

  const incrementTrialUsage = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsUpdating(true);
      const currentUsed = getTrialsUsed();
      const totalIdentifications = (user.publicMetadata?.totalIdentifications as number) || 0;

      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          trialsUsed: currentUsed + 1,
          totalIdentifications: totalIdentifications + 1,
        },
      });

      return true;
    } catch (error) {
      console.error('Error updating trial usage:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user, getTrialsUsed]);

  return {
    trialsUsed: getTrialsUsed(),
    remainingTrials: getRemainingTrials(),
    hasTrialsRemaining: hasTrialsRemaining(),
    incrementTrialUsage,
    isUpdating,
  };
}

/**
 * Hook to check premium subscription status
 */
export function useCheckPremium() {
  const { user } = useUser();

  const isPremium = useCallback((): boolean => {
    if (!user) return false;

    const isPremiumUser = user.publicMetadata?.isPremium as boolean;
    const subscriptionExpiry = user.publicMetadata?.subscriptionExpiry as string;

    // Check if premium and not expired
    if (isPremiumUser && subscriptionExpiry) {
      const expiryDate = new Date(subscriptionExpiry);
      return expiryDate > new Date();
    }

    return isPremiumUser || false;
  }, [user]);

  const getSubscriptionTier = useCallback((): 'free' | 'monthly' | 'annual' => {
    if (!user) return 'free';
    return (user.publicMetadata?.subscriptionTier as 'free' | 'monthly' | 'annual') || 'free';
  }, [user]);

  return {
    isPremium: isPremium(),
    subscriptionTier: getSubscriptionTier(),
  };
}

/**
 * Hook to record identification and check limits
 */
export function useRecordIdentification() {
  const { user } = useUser();
  const { hasTrialsRemaining, incrementTrialUsage } = useTrialStatus();
  const { isPremium } = useCheckPremium();
  const [isRecording, setIsRecording] = useState(false);

  /**
   * Check if user can perform an identification
   * Returns true if premium OR has trials remaining
   */
  const canIdentify = useCallback((): boolean => {
    return isPremium || hasTrialsRemaining;
  }, [isPremium, hasTrialsRemaining]);

  /**
   * Record an identification attempt
   * Increments trial usage if not premium
   * Returns true if successful, false if limit reached
   */
  const recordIdentification = useCallback(async (): Promise<{
    success: boolean;
    shouldShowPaywall: boolean;
    message: string;
  }> => {
    if (!user) {
      return {
        success: false,
        shouldShowPaywall: false,
        message: 'Please sign in to continue',
      };
    }

    // Premium users have unlimited access
    if (isPremium) {
      try {
        setIsRecording(true);
        const totalIdentifications = (user.publicMetadata?.totalIdentifications as number) || 0;

        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            totalIdentifications: totalIdentifications + 1,
          },
        });

        return {
          success: true,
          shouldShowPaywall: false,
          message: 'Identification recorded',
        };
      } catch (error) {
        console.error('Error recording identification:', error);
        return {
          success: false,
          shouldShowPaywall: false,
          message: 'Error recording identification',
        };
      } finally {
        setIsRecording(false);
      }
    }

    // Free users - check trials
    if (!hasTrialsRemaining) {
      return {
        success: false,
        shouldShowPaywall: true,
        message: 'Free trial limit reached. Upgrade to premium for unlimited identifications.',
      };
    }

    // Record trial usage
    setIsRecording(true);
    const updated = await incrementTrialUsage();
    setIsRecording(false);

    if (!updated) {
      return {
        success: false,
        shouldShowPaywall: false,
        message: 'Error recording trial usage',
      };
    }

    return {
      success: true,
      shouldShowPaywall: false,
      message: 'Identification recorded',
    };
  }, [user, isPremium, hasTrialsRemaining, incrementTrialUsage]);

  return {
    canIdentify: canIdentify(),
    recordIdentification,
    isRecording,
  };
}
