/**
 * Protected Route Component
 *
 * Wraps screens that require authentication
 * Redirects to auth screen if not signed in
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../constants/theme';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

export default function ProtectedRoute({
  children,
  requirePremium = false,
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to auth screen
      navigation.navigate('Auth' as never);
    }
  }, [isLoaded, isSignedIn, navigation]);

  // Show loading while checking auth state
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  // Don't render children if not signed in
  if (!isSignedIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
});
