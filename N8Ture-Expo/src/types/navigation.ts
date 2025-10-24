/**
 * Navigation type definitions for N8ture AI app
 */

import { CaptureConfig } from './capture';

// Bottom Tab Navigator (AllTrails-style: 2 tabs)
export type MainTabsParamList = {
  WalksTab: undefined;
  HistoryTab: undefined;
};

// Root Stack Navigator (for modals and main tabs)
export type RootStackParamList = {
  // Main tabs container
  MainTabs: undefined;

  // Auth screens
  Auth: undefined;

  // Capture modals
  Camera: {
    config?: CaptureConfig;
  };
  AudioRecording: {
    config?: CaptureConfig;
  };
  DualCapture: {
    config?: CaptureConfig;
  };

  // Results and details
  Identification: {
    imageUri: string;
    type: 'plant' | 'wildlife' | 'fungi';
  };
  Results: {
    imageUri: string;
    imageBase64?: string;
    identificationId?: string;
  };
  AudioResults: {
    audioUri: string;
    identificationId?: string;
  };
  SpeciesDetail: {
    speciesId: string;
    speciesName: string;
  };

  // Walk screens
  WalkSession: {
    sessionId: string;
    isActive?: boolean;
  };

  // Settings and profile
  Settings: undefined;
  Profile: undefined;

  // Subscription
  Paywall: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
