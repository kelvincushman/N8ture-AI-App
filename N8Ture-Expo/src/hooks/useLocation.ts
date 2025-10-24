/**
 * useLocation Hook
 *
 * Manages location permissions and GPS coordinate capture for N8ture AI App.
 * Captures latitude/longitude when users take photos of species.
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  timestamp: number;
}

export interface UseLocationReturn {
  location: LocationCoordinates | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationCoordinates | null>;
  clearError: () => void;
}

/**
 * Hook to manage location permissions and GPS capture
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  /**
   * Check if location permission is already granted
   */
  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (err) {
      console.error('Error checking location permission:', err);
      setHasPermission(false);
    }
  };

  /**
   * Request location permission from user
   */
  const requestPermission = async (): Promise<boolean> => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);

      if (!granted) {
        setError('Location permission denied. GPS coordinates will not be saved.');
      }

      return granted;
    } catch (err) {
      const errorMessage = 'Failed to request location permission';
      setError(errorMessage);
      console.error(errorMessage, err);
      return false;
    }
  };

  /**
   * Get current GPS coordinates
   * Returns null if permission denied or error occurs
   */
  const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
    // Check permission first
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setError('Location permission is required to log GPS coordinates');
        return null;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get current position with balanced accuracy (good for species identification)
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // ~100m accuracy, faster than High
      });

      const coords: LocationCoordinates = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy || undefined,
        altitude: result.coords.altitude,
        timestamp: result.timestamp,
      };

      setLocation(coords);
      return coords;
    } catch (err) {
      const errorMessage = 'Failed to get current location. GPS coordinates will not be saved.';
      setError(errorMessage);
      console.error(errorMessage, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  return {
    location,
    hasPermission,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    clearError,
  };
}
