import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/constants/theme';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="light" backgroundColor={theme.colors.primary.main} />
    </>
  );
}
