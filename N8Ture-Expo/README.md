# N8ture AI - React Native Expo App

Wildlife, plant, and fungi identification powered by AI. Built with React Native, Expo, and Google Gemini API.

## Features

- **AI-Powered Identification**: Identify wildlife, plants, and fungi using camera
- **Audio Analysis**: Record bird songs and wildlife sounds for identification
- **AudioMoth Integration**: Connect to AudioMoth devices via Bluetooth
- **Location Tracking**: Track your discoveries with GPS
- **User Authentication**: Secure authentication with Clerk
- **Cloud Backend**: Firebase Cloud Functions and Firestore
- **Cross-Platform**: iOS, Android, and Web from a single codebase

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Authentication**: Clerk
- **Backend**: Firebase (Cloud Functions, Firestore, Storage)
- **AI**: Google Gemini API
- **Camera**: expo-camera
- **Audio**: expo-av
- **Bluetooth**: react-native-ble-plx

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Expo CLI
- iOS Simulator (macOS only) or Android Emulator
- Expo Go app for testing on physical devices

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kelvincushman/N8ture-AI-App.git
   cd N8ture-AI-App/N8Ture-Expo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.template .env
   ```

   Edit `.env` and add your API keys:
   - Clerk publishable key
   - Firebase configuration
   - Other required credentials

4. **Start the development server:**

   ```bash
   npm start
   ```

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser

### Project Structure

```
N8Ture-Expo/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation configuration
│   ├── services/        # API and service integrations
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # Theme, colors, constants
│   ├── types/           # TypeScript type definitions
│   └── assets/          # Images, fonts, etc.
├── App.tsx              # Root component
├── app.json             # Expo configuration
├── eas.json             # EAS Build configuration
└── package.json         # Dependencies
```

## Configuration

### App Permissions

The app requires the following permissions:

**iOS:**
- Camera access
- Microphone access
- Location (when in use)
- Bluetooth

**Android:**
- Camera
- Record audio
- Fine/coarse location
- Bluetooth (connect, scan)

Permissions are configured in `app.json`.

### Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the client.

See `.env.template` for required variables.

## Building for Production

### Development Build

For testing native features like Bluetooth:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --profile development --platform ios

# Build for Android
eas build --profile development --platform android
```

### Production Build

```bash
# Build for app stores
eas build --profile production --platform all
```

## Design System

The app uses the N8ture AI brand colors:

- **Primary**: #708C6A (Leaf Khaki)
- **Accent**: #8FAF87 (Accent Green)
- **Dark**: #2D3A30 (Forest Charcoal)

See `src/constants/theme.ts` for the complete design system.

## Key Integrations

### Clerk Authentication

Clerk handles user authentication and management. Configure your Clerk instance and add the publishable key to `.env`.

### Firebase

Firebase provides:
- Cloud Functions for backend logic
- Firestore for data storage
- Storage for images/audio
- Analytics and monitoring

### Google Gemini API

The Gemini API powers AI identification. API calls are made through Firebase Cloud Functions to keep the API key secure.

### AudioMoth Bluetooth

Connect to AudioMoth recording devices via Bluetooth Low Energy (BLE) using `react-native-ble-plx`.

**Note**: Bluetooth requires a development build. It will not work with Expo Go.

## Development Workflow

This project uses an agent-based development workflow with specialized agents:

- **expo-expert**: Expo configuration and native modules
- **clerk-auth-expert**: Authentication implementation
- **firebase-expert**: Backend services
- **gemini-api-expert**: AI integration
- **ui-ux-implementation-agent**: UI components
- **navigation-expert**: Navigation structure

See `/agents/` directory for agent configurations.

## Features Overview

### Camera-Based Species Identification

Complete camera-based species identification system!

**Features:**
- ✅ Full-screen camera with expo-camera
- ✅ Image capture with preview
- ✅ Google Gemini Vision API integration
- ✅ Firebase Cloud Functions backend
- ✅ Detailed species information
- ✅ Edibility and toxicity warnings
- ✅ Trial system integration
- ✅ N8ture AI branded UI

### Audio Recording Infrastructure (Phase 4)

Production-ready audio recording for bird song and wildlife sound identification!

**Features:**
- ✅ High-quality audio recording (up to 60 seconds)
- ✅ Real-time waveform visualization
- ✅ Adjustable duration presets (10s, 30s, 60s)
- ✅ Quality presets (low, medium, high)
- ✅ Pause/resume recording
- ✅ Audio playback controls
- ✅ Trial system integration
- ✅ Firebase Storage upload support
- ✅ Comprehensive error handling
- ✅ Nature-inspired UI with animations
- ✅ 100% test coverage

**See [AUDIO_RECORDING_GUIDE.md](./AUDIO_RECORDING_GUIDE.md) for complete documentation.**

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **For Testing (Mock Service):**
   - Camera feature works out of the box with mock data
   - No Firebase setup required for UI testing
   - Returns sample Red Fox data

3. **For Production (Real AI):**
   - Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete setup
   - Configure Firebase project
   - Get Gemini API key
   - Deploy Cloud Functions

### Documentation

#### Implementation Docs
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete Firebase and Gemini setup guide
- **[CAMERA_USAGE.md](./CAMERA_USAGE.md)** - User guide for camera feature
- **[AUDIO_RECORDING_GUIDE.md](./AUDIO_RECORDING_GUIDE.md)** - Audio recording infrastructure guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

#### Architecture Docs (in `/docs/react-expo/`)
- [Camera Integration](../docs/react-expo/CAMERA_INTEGRATION.md)
- [Microphone Integration](../docs/react-expo/MICROPHONE_INTEGRATION.md)
- [Bluetooth Integration](../docs/react-expo/BLUETOOTH_INTEGRATION.md)
- [Gemini API Integration](../docs/react-expo/GEMINI_API_INTEGRATION.md)
- [Branding & Design System](../docs/react-expo/BRANDING_DESIGN_SYSTEM.md)

## Troubleshooting

### Common Issues

**Native module not found:**
- Rebuild development client after adding native modules
- Run `eas build --profile development`

**Permissions not working:**
- Check `app.json` plugin configurations
- Rebuild the app
- On iOS, delete and reinstall the app

**Build fails:**
- Run `npx expo-doctor` to diagnose issues
- Check EAS build logs
- Verify all dependencies are compatible with Expo SDK 54

**Camera not working:**
- Camera requires physical device (won't work in web browser)
- Check camera permissions are granted
- See [CAMERA_USAGE.md](./CAMERA_USAGE.md) for troubleshooting

**Audio recording not working:**
- Microphone requires physical device
- Check microphone permissions are granted
- See [AUDIO_RECORDING_GUIDE.md](./AUDIO_RECORDING_GUIDE.md) for troubleshooting

**"Firebase not initialized" error:**
- This is normal for development without Firebase setup
- App automatically uses mock service
- For production, follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**Dependency conflicts:**
- Use `--legacy-peer-deps` flag with npm:
  ```bash
  npm install --legacy-peer-deps
  ```

### Getting Help

- Check `/docs/react-expo/` documentation
- Review agent configurations in `/agents/`
- Expo documentation: https://docs.expo.dev
- Create an issue: https://github.com/kelvincushman/N8ture-AI-App/issues

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on iOS and Android
4. Submit a pull request

## License

[Your License Here]

## Contact

For questions or support, please contact [Your Contact Info].

---

Built with Expo and Claude Code
