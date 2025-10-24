import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/clerk-expo';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/constants/theme';
import { env } from './src/config/env';
import { tokenCache } from './src/services/clerk';

export default function App() {
  return (
    <ClerkProvider
      publishableKey={env.clerk.publishableKey}
      tokenCache={tokenCache}
    >
      <RootNavigator />
      <StatusBar style="light" backgroundColor={theme.colors.primary.main} />
    </ClerkProvider>
  );
}
