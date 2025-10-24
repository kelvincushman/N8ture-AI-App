/**
 * Trial Badge Component
 *
 * Displays remaining free trials for non-premium users
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import { useTrialStatus } from '../../hooks/useTrialStatus';
import { useCheckPremium } from '../../hooks/useTrialStatus';
import { MAX_FREE_TRIALS } from '../../types/user';

interface TrialBadgeProps {
  showUpgradeButton?: boolean;
  compact?: boolean;
}

export default function TrialBadge({
  showUpgradeButton = true,
  compact = false,
}: TrialBadgeProps) {
  const navigation = useNavigation();
  const { remainingTrials, trialsUsed } = useTrialStatus();
  const { isPremium, subscriptionTier } = useCheckPremium();

  const handleUpgrade = () => {
    // Navigate to paywall/subscription screen
    navigation.navigate('Paywall' as never);
  };

  // Premium users don't need trial badge
  if (isPremium) {
    return (
      <View style={[styles.container, styles.premiumContainer, compact && styles.compact]}>
        <Text style={[styles.premiumText, compact && styles.compactText]}>
          ⭐ Premium {subscriptionTier === 'annual' ? 'Annual' : 'Monthly'}
        </Text>
      </View>
    );
  }

  const isLowTrials = remainingTrials <= 1;
  const isOutOfTrials = remainingTrials === 0;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          isOutOfTrials && styles.warningContainer,
          compact && styles.compact,
        ]}
      >
        <View style={styles.infoContainer}>
          {!compact && (
            <Text style={styles.label}>
              {isOutOfTrials ? 'Free trials used' : 'Free trials remaining'}
            </Text>
          )}
          <Text style={[styles.count, compact && styles.compactText]}>
            {remainingTrials} / {MAX_FREE_TRIALS}
          </Text>
        </View>

        {showUpgradeButton && isLowTrials && !compact && (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        )}
      </View>

      {isOutOfTrials && !compact && (
        <TouchableOpacity style={styles.fullUpgradeButton} onPress={handleUpgrade}>
          <Text style={styles.fullUpgradeButtonText}>
            Get Unlimited Identifications - Upgrade Now
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.status.info,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  compact: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  premiumContainer: {
    backgroundColor: theme.colors.primary.main,
  },
  warningContainer: {
    backgroundColor: theme.colors.warning,
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.primary.dark,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  count: {
    ...theme.typography.h3,
    color: theme.colors.primary.dark,
    fontWeight: '700',
  },
  compactText: {
    ...theme.typography.body2,
    fontWeight: '600',
  },
  premiumText: {
    ...theme.typography.body1,
    color: theme.colors.primary.contrastText,
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  upgradeButtonText: {
    ...theme.typography.caption,
    color: theme.colors.primary.contrastText,
    fontWeight: '600',
  },
  fullUpgradeButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  fullUpgradeButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
  },
});
