/**
 * Navigation type definitions for N8ture AI app
 */

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Identification: {
    imageUri: string;
    type: 'plant' | 'wildlife' | 'fungi';
  };
  Results: {
    identificationId: string;
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
