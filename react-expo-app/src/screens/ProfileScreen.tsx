/**
 * Profile Screen
 *
 * Displays user profile, subscription status, and account management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useTrialStatus } from '../hooks/useTrialStatus';
import { useCheckPremium } from '../hooks/useTrialStatus';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import TrialBadge from '../components/trial/TrialBadge';

function ProfileScreenContent() {
  const navigation = useNavigation();
  const { userProfile, signOut } = useAuth();
  const { trialsUsed, remainingTrials } = useTrialStatus();
  const { isPremium, subscriptionTier } = useCheckPremium();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSigningOut(true);
              await signOut();
              navigation.navigate('Home' as never);
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  const handleManageSubscription = () => {
    // TODO: Implement subscription management
    Alert.alert(
      'Manage Subscription',
      'Subscription management will be available soon.',
      [{ text: 'OK' }]
    );
  };

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          {userProfile.imageUrl ? (
            <Image source={{ uri: userProfile.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {userProfile.firstName?.[0]?.toUpperCase() ||
                 userProfile.email[0].toUpperCase()}
              </Text>
            </View>
          )}

          <Text style={styles.name}>
            {userProfile.fullName || userProfile.email}
          </Text>
          <Text style={styles.email}>{userProfile.email}</Text>
        </View>

        {/* Trial Badge */}
        <View style={styles.section}>
          <TrialBadge showUpgradeButton={true} />
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {userProfile.metadata.totalIdentifications || 0}
              </Text>
              <Text style={styles.statLabel}>Total Identifications</Text>
            </View>

            {!isPremium && (
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{trialsUsed}</Text>
                <Text style={styles.statLabel}>Free Trials Used</Text>
              </View>
            )}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.menuContainer}>
            {isPremium && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleManageSubscription}
              >
                <Text style={styles.menuItemText}>Manage Subscription</Text>
                <Text style={styles.menuItemSubtext}>
                  {subscriptionTier === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
                </Text>
              </TouchableOpacity>
            )}

            {!isPremium && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => console.log('Navigate to upgrade')}
              >
                <Text style={[styles.menuItemText, styles.upgradeText]}>
                  Upgrade to Premium
                </Text>
                <Text style={styles.menuItemSubtext}>
                  Unlock unlimited identifications
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <ActivityIndicator color={theme.colors.error} />
              ) : (
                <Text style={[styles.menuItemText, styles.signOutText]}>
                  Sign Out
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>N8ture AI v1.0.0</Text>
          <Text style={styles.footerText}>
            Member since {new Date(userProfile.metadata.createdAt || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ProfileScreen() {
  return (
    <ProtectedRoute>
      <ProfileScreenContent />
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...theme.typography.h1,
    color: theme.colors.primary.contrastText,
  },
  name: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  email: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: {
    ...theme.typography.h1,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  menuItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  menuItemText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  menuItemSubtext: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  upgradeText: {
    color: theme.colors.primary.main,
  },
  signOutText: {
    color: theme.colors.error,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.text.hint,
    marginHorizontal: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.text.hint,
  },
  footerText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
});
