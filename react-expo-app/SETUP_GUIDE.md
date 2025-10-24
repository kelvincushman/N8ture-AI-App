# N8ture AI Setup Guide

Step-by-step guide to set up the N8ture AI React Native Expo app.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Firebase Setup](#firebase-setup)
5. [Clerk Authentication Setup](#clerk-authentication-setup)
6. [Running the App](#running-the-app)
7. [Building for Devices](#building-for-devices)
8. [Next Steps](#next-steps)

## Prerequisites

### Required Software

- **Node.js** (v18 or later): [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**: [Download](https://git-scm.com/)
- **Expo CLI**: Will be installed via npx

### Optional (for native development)

- **Xcode** (macOS only) - For iOS development
- **Android Studio** - For Android development
- **EAS CLI** - For building native apps

### Mobile Testing Options

- **Expo Go app** - For basic testing (won't work with Bluetooth)
- **Physical device** - For full feature testing
- **iOS Simulator** - macOS only
- **Android Emulator** - All platforms

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kelvincushman/N8ture-AI-App.git
cd N8ture-AI-App/react-expo-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native and Expo
- Navigation libraries
- Clerk authentication
- Camera, audio, and Bluetooth modules

### 3. Verify Installation

```bash
npx expo-doctor
```

This command checks for common setup issues.

## Environment Configuration

### 1. Create Environment File

```bash
cp .env.template .env
```

### 2. Configure Environment Variables

Open `.env` in your text editor. You'll need to fill in:

- Clerk publishable key
- Firebase configuration
- Other API keys

We'll get these values in the following sections.

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `n8ture-ai` (or your preferred name)
4. Disable Google Analytics (optional for now)
5. Click "Create project"

### 2. Enable Firebase Services

**Cloud Functions:**
1. In Firebase Console, go to "Build" → "Functions"
2. Click "Get started"
3. Choose a region (e.g., us-central1)

**Firestore Database:**
1. Go to "Build" → "Firestore Database"
2. Click "Create database"
3. Start in production mode
4. Choose a region

**Storage:**
1. Go to "Build" → "Storage"
2. Click "Get started"
3. Use default security rules

**Authentication:**
1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Enable "Email/Password" and "Google" providers

### 3. Get Firebase Configuration

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register app name: "N8ture AI Web"
5. Copy the configuration values

Add these to your `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Add Mobile Apps to Firebase

**For iOS:**
1. In Project settings, add an iOS app
2. iOS bundle ID: `com.n8ture.ai`
3. Download `GoogleService-Info.plist` (save for later)

**For Android:**
1. In Project settings, add an Android app
2. Android package name: `com.n8ture.ai`
3. Download `google-services.json` (save for later)

## Clerk Authentication Setup

### 1. Create Clerk Account

1. Go to [Clerk](https://clerk.com/)
2. Sign up for a free account
3. Create a new application: "N8ture AI"

### 2. Configure Authentication

1. In Clerk Dashboard, go to "Configure" → "Email, Phone, Username"
2. Enable email authentication
3. Optionally enable Google OAuth

### 3. Get Publishable Key

1. In Clerk Dashboard, go to "API Keys"
2. Copy the "Publishable key" (starts with `pk_test_`)

Add to your `.env` file:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. Configure Clerk for Mobile

1. In Clerk Dashboard, go to "Configure" → "Applications"
2. Add your app's URL scheme: `n8ture-ai://`
3. This enables deep linking for OAuth

## Running the App

### 1. Start Development Server

```bash
npm start
```

This opens the Expo development server in your terminal.

### 2. Choose a Platform

**Option A: Expo Go (Limited Features)**

1. Install Expo Go on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code from the terminal
3. **Note**: Bluetooth features won't work in Expo Go

**Option B: iOS Simulator (macOS only)**

```bash
npm run ios
```

**Option C: Android Emulator**

1. Start Android emulator from Android Studio
2. Run:

```bash
npm run android
```

**Option D: Web Browser**

```bash
npm run web
```

### 3. Verify App Works

You should see the N8ture AI home screen with:
- Welcome message
- "Open Camera" button
- "View History" button
- Info cards about features

## Building for Devices

For full feature testing (especially Bluetooth), you need a development build.

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure EAS Project

```bash
eas build:configure
```

This creates/updates `eas.json`.

### 4. Build Development Client

**For iOS:**

```bash
eas build --profile development --platform ios
```

**For Android:**

```bash
eas build --profile development --platform android
```

**For both:**

```bash
eas build --profile development --platform all
```

The build process takes 10-20 minutes. You'll get a download link when complete.

### 5. Install on Device

**iOS:**
- Download IPA file from EAS
- Use Apple Configurator or TestFlight

**Android:**
- Download APK file from EAS
- Install directly on device

## Next Steps

### 1. Implement Camera Feature

Follow the [Camera Integration Guide](../docs/react-expo/CAMERA_INTEGRATION.md) to add photo capture.

### 2. Set Up Google Gemini API

Follow the [Gemini API Integration Guide](../docs/react-expo/GEMINI_API_INTEGRATION.md) to enable AI identification.

### 3. Add Audio Recording

Follow the [Microphone Integration Guide](../docs/react-expo/MICROPHONE_INTEGRATION.md) for bird song recording.

### 4. Enable Bluetooth

Follow the [Bluetooth Integration Guide](../docs/react-expo/BLUETOOTH_INTEGRATION.md) for AudioMoth connectivity.

### 5. Customize UI

- Edit `src/constants/theme.ts` for brand colors
- Create components in `src/components/`
- Add screens in `src/screens/`

## Troubleshooting

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### Environment variables not working

- Ensure they're prefixed with `EXPO_PUBLIC_`
- Restart the development server
- Clear cache: `npx expo start -c`

### Build fails

```bash
# Check for issues
npx expo-doctor

# View detailed logs
eas build --profile development --platform ios --local
```

### Permissions not working

- Rebuild the app after changing `app.json`
- On iOS, delete app and reinstall
- Check system settings for permissions

## Getting Help

- **Documentation**: Check `/docs/react-expo/`
- **Agents**: Review `/agents/` for implementation patterns
- **Expo Docs**: https://docs.expo.dev
- **Issues**: https://github.com/kelvincushman/N8ture-AI-App/issues

---

You're all set! Start building features using the agent-based workflow.
