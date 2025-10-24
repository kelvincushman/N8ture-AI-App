/**
 * Paywall Screen
 *
 * Displays subscription pricing and premium features.
 * Follows N8ture AI freemium model (3 free identifications).
 *
 * Features:
 * - Monthly ($4.99) and Annual ($39.99) plans
 * - Free vs Premium feature comparison
 * - "Continue with Limited" option
 * - Restore purchases
 *
 * TODO: Integrate RevenueCat for actual In-App Purchases
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/theme';
import { useUser } from '@clerk/clerk-expo';
import { useCheckPremium } from '../hooks/useTrialStatus';
import { AppHeader } from '../components/navigation/AppHeader';

type SubscriptionPlan = 'monthly' | 'annual';

interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  price: string;
  period: string;
  pricePerMonth: number;
  savings?: string;
  badge?: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$4.99',
    period: 'per month',
    pricePerMonth: 4.99,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$39.99',
    period: 'per year',
    pricePerMonth: 3.33,
    savings: 'Save 33%',
    badge: 'BEST VALUE',
  },
];

const FREE_FEATURES = [
  '3 lifetime identifications',
  'Basic species information',
  'Safety warnings',
  'Common name and scientific name',
];

const PREMIUM_FEATURES = [
  'Unlimited identifications',
  'High-resolution capture',
  'Detailed species information',
  'Habitat and range data',
  'Medicinal uses and benefits',
  'Cooking and preparation methods',
  'Offline mode (coming soon)',
  'Location tracking (coming soon)',
  'Export history (coming soon)',
];

export default function PaywallScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const { isPremium } = useCheckPremium();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);

    try {
      // TODO: Implement RevenueCat subscription flow
      // For now, simulate subscription by updating user metadata
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      if (user) {
        const expiryDate = new Date();
        if (selectedPlan === 'monthly') {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            isPremium: true,
            subscriptionTier: selectedPlan,
            subscriptionExpiry: expiryDate.toISOString(),
          },
        });

        Alert.alert(
          'Success!',
          `You're now a premium member with ${selectedPlan === 'annual' ? 'annual' : 'monthly'} subscription.`,
          [
            {
              text: 'Start Exploring',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert(
        'Subscription Failed',
        'There was an error processing your subscription. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueWithLimited = () => {
    navigation.goBack();
  };

  const handleRestorePurchases = async () => {
    setIsProcessing(true);

    try {
      // TODO: Implement RevenueCat restore purchases
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        'Restore Purchases',
        'No previous purchases found for this account.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Restore Failed', 'Could not restore purchases. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // If already premium, show success message
  if (isPremium) {
    return (
      <View style={styles.container}>
        <AppHeader title="Premium" showBackButton={true} />
        <View style={styles.premiumContainer}>
          <View style={styles.premiumIcon}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.primary.main} />
          </View>
          <Text style={styles.premiumTitle}>You're Premium!</Text>
          <Text style={styles.premiumSubtitle}>
            Enjoy unlimited identifications and all premium features.
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={() => navigation.goBack()}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Upgrade to Premium" showBackButton={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[theme.colors.primary.light + '30', theme.colors.primary.main + '10']}
            style={styles.heroGradient}
          >
            <Ionicons name="leaf" size={64} color={theme.colors.primary.main} />
            <Text style={styles.heroTitle}>Unlock Unlimited Nature</Text>
            <Text style={styles.heroSubtitle}>
              Identify unlimited species and access detailed information
            </Text>
          </LinearGradient>
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {PRICING_PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
              ]}
              onPress={() => handleSelectPlan(plan.id)}
              activeOpacity={0.8}
            >
              {plan.badge && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>
                    {plan.price}
                    <Text style={styles.planPeriod}> {plan.period}</Text>
                  </Text>
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                  <Text style={styles.pricePerMonth}>
                    ${plan.pricePerMonth.toFixed(2)}/month
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioButton,
                    selectedPlan === plan.id && styles.radioButtonSelected,
                  ]}
                >
                  {selectedPlan === plan.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features Comparison */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You Get</Text>

          {/* Premium Features */}
          <View style={styles.featureGroup}>
            <Text style={styles.featureGroupTitle}>✨ Premium Features</Text>
            {PREMIUM_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.primary.main}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Free Features (for comparison) */}
          <View style={styles.featureGroup}>
            <Text style={styles.featureGroupTitle}>🆓 Free (Limited)</Text>
            {FREE_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
                <Text style={[styles.featureText, styles.freeFeatureText]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, isProcessing && styles.subscribeButtonDisabled]}
          onPress={handleSubscribe}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.subscribeButtonText}>
                Subscribe Now - {PRICING_PLANS.find((p) => p.id === selectedPlan)?.price}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        {/* Continue with Limited */}
        <TouchableOpacity
          style={styles.continueWithLimitedButton}
          onPress={handleContinueWithLimited}
          disabled={isProcessing}
        >
          <Text style={styles.continueWithLimitedText}>Continue with Limited Access</Text>
        </TouchableOpacity>

        {/* Restore Purchases */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={isProcessing}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          Subscriptions auto-renew. Cancel anytime in Settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  // Hero Section
  heroSection: {
    marginBottom: theme.spacing.xl,
  },
  heroGradient: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Pricing Plans
  plansSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border || '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.light + '10',
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary.main,
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  savingsBadge: {
    backgroundColor: theme.colors.status.safe || '#8FAF87',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  savingsText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
  },
  pricePerMonth: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border || '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary.main,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary.main,
  },
  // Features Section
  featuresSection: {
    marginBottom: theme.spacing.xl,
  },
  featureGroup: {
    marginBottom: theme.spacing.lg,
  },
  featureGroupTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  freeFeatureText: {
    color: theme.colors.text.secondary,
  },
  // Buttons
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
  continueWithLimitedButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  continueWithLimitedText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textDecorationLine: 'underline',
  },
  restoreButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  restoreButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary.main,
    textDecorationLine: 'underline',
  },
  footerText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Premium Status (if already subscribed)
  premiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  premiumIcon: {
    marginBottom: theme.spacing.lg,
  },
  premiumTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  premiumSubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl * 2,
    borderRadius: theme.borderRadius.full,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
});
