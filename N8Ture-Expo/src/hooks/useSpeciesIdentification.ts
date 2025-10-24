/**
 * Species identification hook
 *
 * Manages species identification flow with trial system integration
 */

import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { identifySpecies, mockIdentifySpecies } from '../services/identificationService';
import { SpeciesIdentification, SpeciesCategory } from '../types/species';
import { useAuth } from './useAuth';
import { useCheckPremium } from './useTrialStatus';
import { isFirebaseInitialized } from '../services/firebase';

export interface IdentificationState {
  loading: boolean;
  error: string | null;
  result: SpeciesIdentification | null;
}

export function useSpeciesIdentification() {
  const navigation = useNavigation();
  const { isSignedIn } = useAuth();
  const { isPremium } = useCheckPremium();

  const [state, setState] = useState<IdentificationState>({
    loading: false,
    error: null,
    result: null,
  });

  /**
   * Identify species from image
   *
   * @param imageBase64 - Base64 encoded image data
   * @param category - Optional species category hint
   * @returns Identification result or null if failed
   */
  const identify = useCallback(
    async (
      imageBase64: string,
      category?: SpeciesCategory
    ): Promise<SpeciesIdentification | null> => {
      // Check authentication
      if (!isSignedIn) {
        setState({ loading: false, error: 'Authentication required', result: null });
        Alert.alert('Sign In Required', 'Please sign in to use species identification.');
        navigation.navigate('Auth' as never);
        return null;
      }

      setState({ loading: true, error: null, result: null });

      try {
        // Call identification service
        // Use mock service if Firebase is not initialized (for development)
        const useMock = !isFirebaseInitialized();

        let result: SpeciesIdentification;
        if (useMock) {
          console.log('Using mock identification (Firebase not configured)');
          result = await mockIdentifySpecies(imageBase64, category);
        } else {
          result = await identifySpecies(imageBase64, category);
        }

        // Update state with result
        setState({ loading: false, error: null, result });

        return result;
      } catch (error: any) {
        console.error('Error identifying species:', error);

        const errorMessage = error.message || 'Failed to identify species';
        setState({ loading: false, error: errorMessage, result: null });

        // Show user-friendly error
        Alert.alert('Identification Error', errorMessage, [{ text: 'OK' }]);

        return null;
      }
    },
    [isSignedIn, navigation]
  );

  /**
   * Retry identification after error
   */
  const retry = useCallback(
    async (imageBase64: string, category?: SpeciesCategory) => {
      return identify(imageBase64, category);
    },
    [identify]
  );

  /**
   * Clear identification state
   */
  const clear = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  /**
   * Handle low confidence results
   */
  const isLowConfidence = useCallback((confidence: number): boolean => {
    return confidence < 30;
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    result: state.result,
    identify,
    retry,
    clear,
    isLowConfidence,
  };
}

/**
 * Hook to check if identification should show paywall
 * This is used in conjunction with the trial system
 */
export function useIdentificationPaywall() {
  const navigation = useNavigation();
  const { isPremium } = useCheckPremium();

  /**
   * Show paywall if user is not premium
   */
  const showPaywallIfNeeded = useCallback((): boolean => {
    if (!isPremium) {
      Alert.alert(
        'Upgrade to Premium',
        'Get unlimited species identifications, high-res capture, detailed species data, and more!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          {
            text: 'Upgrade Now',
            onPress: () => {
              // TODO: Navigate to paywall screen
              console.log('Navigate to paywall');
            },
          },
        ]
      );
      return true;
    }
    return false;
  }, [isPremium]);

  return {
    showPaywallIfNeeded,
    isPremium,
  };
}
