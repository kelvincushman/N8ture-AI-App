# Integration Specifications

This document summarizes the integration specifications for the key components of the React Expo version of the N8ture AI App.

## Gemini API

- **Library:** `firebase` for communication with Firebase Cloud Functions, `axios` on the backend.
- **Authentication:** API key securely stored in Google Cloud Secret Manager.
- **Architecture:** Client-side requests are sent to Firebase Cloud Functions, which then call the Gemini API.
- **Reference:** [GEMINI_API_INTEGRATION.md](./GEMINI_API_INTEGRATION.md)

## Camera

- **Library:** `expo-camera`
- **Permissions:** Request camera permissions from the user.
- **Functionality:** Capture images for species identification.
- **Reference:** [CAMERA_INTEGRATION.md](./CAMERA_INTEGRATION.md)

## Microphone

- **Library:** `expo-av`
- **Permissions:** Request microphone permissions from the user.
- **Functionality:** Record audio, such as bird songs, for identification.
- **Reference:** [MICROPHONE_INTEGRATION.md](./MICROPHONE_INTEGRATION.md)

## Bluetooth

- **Library:** `react-native-ble-plx`
- **Permissions:** Request Bluetooth and location permissions.
- **Functionality:** Connect to AudioMoth devices for configuration and data retrieval.
- **Development Client:** Requires the use of the Expo development client.
- **Reference:** [BLUETOOTH_INTEGRATION.md](./BLUETOOTH_INTEGRATION.md)

