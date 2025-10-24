/**
 * Navigation type definitions for N8ture AI app
 */

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  AudioRecording: undefined;
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
  History: undefined;
  Profile: undefined;
  Settings: undefined;
  Auth: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
