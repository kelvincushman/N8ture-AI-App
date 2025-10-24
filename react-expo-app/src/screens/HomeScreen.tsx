import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to N8ture AI</Text>
        <Text style={styles.subtitle}>
          Identify wildlife, plants, and fungi with AI-powered analysis
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
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
