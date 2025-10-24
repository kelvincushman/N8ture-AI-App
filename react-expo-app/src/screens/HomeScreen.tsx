import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useRecordIdentification } from '../hooks/useTrialStatus';
import TrialBadge from '../components/trial/TrialBadge';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isSignedIn, userProfile } = useAuth();
  const { canIdentify, recordIdentification, isRecording } = useRecordIdentification();

  const handleOpenCamera = async () => {
    // Check if user is signed in
    if (!isSignedIn) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to use the identification feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Auth' as never),
          },
        ]
      );
      return;
    }

    // Check if user can perform identification
    if (!canIdentify) {
      Alert.alert(
        'Trial Limit Reached',
        'You have used all your free trials. Upgrade to premium for unlimited identifications.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          {
            text: 'Upgrade Now',
            onPress: () => {
              // TODO: Navigate to paywall
              console.log('Navigate to paywall');
            },
          },
        ]
      );
      return;
    }

    // Record the identification attempt
    const result = await recordIdentification();

    if (!result.success) {
      if (result.shouldShowPaywall) {
        Alert.alert(
          'Trial Limit Reached',
          result.message,
          [
            { text: 'Maybe Later', style: 'cancel' },
            {
              text: 'Upgrade Now',
              onPress: () => {
                // TODO: Navigate to paywall
                console.log('Navigate to paywall');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }
      return;
    }

    // TODO: Navigate to camera screen
    Alert.alert('Success', 'Camera will open here. This feature is coming soon!');
  };

  const handleViewHistory = () => {
    if (!isSignedIn) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to view your identification history.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Auth' as never),
          },
        ]
      );
      return;
    }

    // TODO: Navigate to history screen
    Alert.alert('History', 'History screen coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome{userProfile?.firstName ? ` ${userProfile.firstName}` : ''}!
        </Text>
        <Text style={styles.subtitle}>
          Identify wildlife, plants, and fungi with AI-powered analysis
        </Text>

        {/* Trial Badge - only show if signed in */}
        {isSignedIn && (
          <View style={styles.trialBadgeContainer}>
            <TrialBadge showUpgradeButton={true} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleOpenCamera}
            disabled={isRecording}
          >
            <Text style={styles.primaryButtonText}>
              {isRecording ? 'Processing...' : 'Open Camera'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewHistory}
          >
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Camera Identification</Text>
            <Text style={styles.infoText}>
              Take photos of wildlife, plants, and fungi for instant AI identification
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Bird Song Recording</Text>
            <Text style={styles.infoText}>
              Record bird songs and wildlife sounds for audio analysis
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>AudioMoth Integration</Text>
            <Text style={styles.infoText}>
              Connect to AudioMoth devices via Bluetooth for advanced recording
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  trialBadgeContainer: {
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    marginBottom: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  primaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.secondary.main,
    textAlign: 'center',
  },
  infoContainer: {
    gap: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  infoTitle: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.xs,
    color: theme.colors.primary.dark,
  },
  infoText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
});
