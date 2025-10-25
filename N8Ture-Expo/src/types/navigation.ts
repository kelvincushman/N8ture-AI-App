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
    latitude?: number;      // GPS latitude from photo capture
    longitude?: number;     // GPS longitude from photo capture
    accuracy?: number;      // GPS accuracy in meters
  };
  AudioResults: {
    audioUri: string;
    identificationId?: string;
    latitude?: number;      // GPS latitude from recording location
    longitude?: number;     // GPS longitude from recording location
    accuracy?: number;      // GPS accuracy in meters
  };
  SpeciesDetail: {
    speciesId: string;
    speciesName: string;
    imageUri?: string;       // Original photo from identification
    latitude?: number;       // GPS latitude where species was found
    longitude?: number;      // GPS longitude where species was found
    accuracy?: number;       // GPS accuracy in meters
  };
  MapView: undefined;        // Map view of all GPS-tagged identifications

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
