/**
 * Authentication Screen
 *
 * Combined sign-in/sign-up screen with tab navigation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import SignInForm from '../../components/auth/SignInForm';
import SignUpForm from '../../components/auth/SignUpForm';

type AuthMode = 'signin' | 'signup';

export default function AuthScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState<AuthMode>('signin');

  const handleAuthSuccess = () => {
    // Navigate back to previous screen or home
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.appName}>N8ture AI</Text>
              <Text style={styles.tagline}>Discover, Identify, Learn</Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  mode === 'signin' && styles.activeTab,
                ]}
                onPress={() => setMode('signin')}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === 'signin' && styles.activeTabText,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  mode === 'signup' && styles.activeTab,
                ]}
                onPress={() => setMode('signup')}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === 'signup' && styles.activeTabText,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {mode === 'signin' ? (
                <SignInForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToSignUp={() => setMode('signup')}
                />
              ) : (
                <SignUpForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToSignIn={() => setMode('signin')}
                />
              )}
            </View>

            {/* Free Trial Info */}
            <View style={styles.trialInfo}>
              <Text style={styles.trialInfoText}>
                Get 3 free identifications to start exploring nature!
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  appName: {
    ...theme.typography.h1,
    fontSize: 40,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.primary.main,
  },
  tabText: {
    ...theme.typography.button,
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.primary.contrastText,
  },
  formContainer: {
    flex: 1,
  },
  trialInfo: {
    backgroundColor: theme.colors.status.info,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
  },
  trialInfoText: {
    ...theme.typography.body2,
    color: theme.colors.primary.dark,
    textAlign: 'center',
    fontWeight: '600',
  },
});
