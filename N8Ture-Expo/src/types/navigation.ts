/**
 * Navigation type definitions for N8ture AI app
 */

import { CaptureConfig } from './capture';

// Bottom Tab Navigator
export type MainTabsParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  MapTab: undefined;
  ProfileTab: undefined;
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

  // Other screens
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
