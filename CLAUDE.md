# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**N8ture AI App** (formerly N8ture AI App) is a wildlife, plant, and fungi identification application with two parallel implementations:

1. **Kotlin Multiplatform Mobile App** - Native iOS & Android app (production target)
2. **React Web Prototype** - Web-based proof-of-concept for testing AI identification

The app uses AI to identify species from photos and provides safety information, edibility status, and herbal benefits.

## Repository Structure

```
N8ture AI App/
├── Walker App/KAppMakerExtended-main/     # Kotlin Multiplatform app (main implementation)
├── AI App for.../wildlife-id-app-complete/ # React web prototype
├── N8ture AI App_MVP_PRD.md                       # Product requirements (freemium model)
├── N8ture AI App_Implementation_Guide.md          # Technical implementation guide
└── AppStructure_PRD.md                     # API migration guide (Replicate → Gemini)
```

## Development Environment

**Primary IDE:** Android Studio
- The developer is working in Android Studio with the repository cloned locally
- Repository has been pulled from GitHub for local development
- Changes should be committed and pushed from this environment

## Development Commands

### Kotlin Multiplatform App (Main Project)

**Location:** `Walker App/KAppMakerExtended-main/`

#### Android Development
```bash
cd "Walker App/KAppMakerExtended-main"

# Build debug APK
./gradlew :composeApp:assembleDebug

# Find APK output
# Located at: composeApp/build/outputs/apk/debug/composeApp-debug.apk

# Run Android tests
./gradlew :composeApp:connectedDebugAndroidTest

# Get SHA1 for Firebase
./gradlew :composeApp:signingReport
```

#### iOS Development
- Open `iosApp/iosApp.xcproject` in Xcode
- Or use Kotlin Multiplatform Mobile plugin in Android Studio
- Run iOS simulator tests: `./gradlew :composeApp:iosSimulatorArm64Test`

#### Cleaning & Troubleshooting
```bash
# Clean build artifacts
./gradlew clean

# Clean and rebuild
./gradlew clean :composeApp:assembleDebug

# Verify system setup
kdoctor

# Check JDK version (must be 17+)
java -version
```

#### Testing Commands
```bash
# Run common tests (shared code)
./gradlew :composeApp:commonTest

# Run Android instrumented tests
./gradlew :composeApp:connectedDebugAndroidTest

# Run iOS simulator tests
./gradlew :composeApp:iosSimulatorArm64Test

# Get signing certificate SHA1 (for Firebase)
./gradlew :composeApp:signingReport
```

#### Prerequisites
- JDK 17 or higher
- Create `local.properties` from template: `cp local.properties.template local.properties`
- Run `kdoctor` to verify system setup

### React Web Prototype

**Location:** `AI App for Identifying Wildlife, Plants, and Edibility/wildlife-id-app-complete/wildlife-id-app/`

**Important Notes:**
- Uses **pnpm** (not npm) - version 10.4.1 locked via packageManager field
- Backend uses **Python 3** with Flask
- Frontend runs on Vite dev server

```bash
cd "AI App for Identifying Wildlife, Plants, and Edibility/wildlife-id-app-complete/wildlife-id-app"

# Install dependencies
pnpm install  # Uses pnpm@10.4.1

# Development
pnpm dev             # Frontend at http://localhost:5173
pnpm dev -- --host   # With network access

# Backend (separate terminal)
cd backend
pip3 install -r requirements.txt
python3 app.py  # Backend at http://localhost:5000

# Production build
pnpm build
pnpm preview

# Linting
pnpm lint
```

## Architecture

### Kotlin Multiplatform App Architecture

**Platform:** Kotlin Multiplatform Mobile (KMM)
- **Target:** Android (min SDK 24) & iOS (min 14.0)
- **UI Framework:** Compose Multiplatform
- **Backend:** Firebase (Firestore, Auth, Storage, Analytics, Crashlytics)
- **AI Integration:** Google Gemini Vision API (migrating from Replicate)
- **Subscriptions:** RevenueCat (StoreKit 2 for iOS, Google Play Billing 5.0 for Android)
- **Database:** Room (multiplatform)
- **Networking:** Ktor
- **DI:** Koin

#### Key Module Structure
```
composeApp/src/
├── commonMain/        # Shared Kotlin code
│   └── kotlin/com/measify/kappmaker/
│       ├── data/
│       │   ├── source/
│       │   │   ├── local/      # Room DB, DAOs
│       │   │   ├── remote/     # API clients (Ktor)
│       │   │   └── preferences/
│       ├── domain/
│       ├── presentation/
│       │   ├── screens/
│       │   │   ├── paywall/
│       │   │   ├── onboarding/
│       │   │   └── profile/
│       │   └── components/
│       └── di/
├── androidMain/       # Android-specific code
└── iosMain/          # iOS-specific code
```

#### Important Files
- `composeApp/build.gradle.kts` - Main app configuration, dependencies, build variants
- `build.gradle.kts` - Root project plugins
- `gradle/scripts/` - Custom Gradle scripts for package refactoring and screen generation

### React Web Prototype Architecture

**Stack:** React 19 + Vite + Tailwind + shadcn/ui
- **Backend:** Flask (Python) with mock AI identification
- **UI Library:** Radix UI components via shadcn/ui
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod validation
- **State:** React hooks (no global state manager)

**Key Structure:**
```
src/
├── components/ui/     # shadcn/ui components
├── App.jsx           # Main app with routing and identification logic
└── assets/
```

## Business Model: Freemium

- **Free Tier:** 3 lifetime identifications, basic species info, safety warnings
- **Premium:** $4.99/month or $39.99/year
  - Unlimited identifications
  - High-res capture
  - Detailed species data (habitat, medicinal uses, cooking methods)
  - Offline mode
  - Location tracking
  - Export history

### Trial Management Implementation
The Kotlin app implements `TrialManager.kt` to track:
- Remaining free identifications (max 3)
- Trial expiration logic
- Paywall triggers

## Current Implementation Status

### Kotlin Multiplatform App
- ✅ **Core Architecture:** Domain models, data layer, repository pattern complete
- ✅ **AI Integration:** Gemini API service with image identification functional
- ✅ **Database:** Room database v2 with migration from v1
- ✅ **Trial System:** Freemium logic (3 free identifications) implemented
- ✅ **UI Components:** TrialCounter, SafetyIndicator, ConfidenceBadge, SafetyBadge
- ✅ **Use Cases:** Identify, History, Favorites, Search implemented
- 🚧 **Pending:** Camera capture screens (Android/iOS platform-specific)
- 🚧 **Pending:** Identification results screen
- 🚧 **Pending:** Species detail screen with tabs
- 🚧 **Pending:** History and favorites screens
- 🚧 **Pending:** Updated paywall screen
- 🚧 **Pending:** Navigation graph integration
- 🚧 **Pending:** Koin DI module configuration

See `docs/IMPLEMENTATION_STATUS.md` for detailed progress tracking.

### React Web Prototype
- ✅ **Fully functional** web-based proof-of-concept
- ✅ Mock AI backend with European species database
- ✅ Complete UI with shadcn/ui components
- Purpose: Testing and validation of AI identification flow

## AI Integration

### Current Implementation (React Prototype)
- Mock backend in `backend/app.py`
- Simulates identification for birds, plants, fungi
- Mock database with European species

### Target Implementation (Kotlin App)
- **Primary:** Google Gemini Vision API
- **Fallback:** TensorFlow Lite on-device models
- **Categories:** Plants, Wildlife (mammals, birds, reptiles), Fungi, Insects

**API Migration:** The project is migrating from Replicate API to Google Gemini API (see AppStructure_PRD.md). Firebase Cloud Functions will handle API calls.

### Species Data Model
Each identification returns:
- Common name, scientific name, family
- Confidence score (percentage)
- Safety indicator: 🟢 Safe/Edible, 🟡 Caution, 🔴 Dangerous, ⚪ Unknown
- Description, habitat, edibility, herbal benefits
- Similar species (alternatives)
- Conservation status

## Configuration Requirements

### Kotlin App (`local.properties`)

**Setup:**
```bash
# Copy template first
cp local.properties.template local.properties
# Then edit with your API keys
```

**Required keys:**
```properties
sdk.dir=/path/to/Android/sdk
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
REVENUECAT_ANDROID_API_KEY=...
REVENUECAT_IOS_API_KEY=...
ADMOB_APP_ID_ANDROID=...
ADMOB_BANNER_AD_ID_ANDROID=...
ADMOB_INTERSTITIAL_AD_ID_ANDROID=...
ADMOB_REWARDED_AD_ID_ANDROID=...
ADMOB_BANNER_AD_ID_IOS=...
ADMOB_INTERSTITIAL_AD_ID_IOS=...
ADMOB_REWARDED_AD_ID_IOS=...
```

**Getting API Keys:**
- **Gemini API:** https://ai.google.dev/
- **Firebase:** console.firebase.google.com (download `google-services.json` and `GoogleService-Info.plist`)
- **RevenueCat:** revenuecat.com (configure products: `wildid_premium_monthly`, `wildid_premium_annual`)

### React Prototype
- Backend expects Flask on port 5000
- Frontend uses Vite dev server on port 5173
- CORS enabled for cross-origin requests

## Key Technical Considerations

### Kotlin Multiplatform
- **Shared Code:** Business logic, data models, repositories, ViewModels live in `commonMain`
- **Platform-Specific:** Camera access, permissions, file I/O require `expect/actual` declarations
- **Room DB:** KSP compiler runs for all targets (Android, iosX64, iosArm64, iosSimulatorArm64)
- **Testing:** `commonTest` for shared tests, `connectedDebugAndroidTest` for Android UI tests

### Performance Requirements
- App size: < 100MB
- Identification speed: < 3 seconds
- Camera to result: < 5 seconds total
- Offline cache: Last 50 species
- Battery: < 5% per 10 identifications

### Paywall Integration
- RevenueCat manages subscriptions across platforms
- Paywall triggers: After 3rd identification, when accessing premium features
- Must support restore purchases
- "Continue with Limited" option required

## Development Workflow Notes

1. **Firebase Setup:** Both apps require Firebase project configuration
   - Download `google-services.json` to `composeApp/` (Android)
   - Download `GoogleService-Info.plist` to `iosApp/iosApp/` (iOS)
2. **API Keys:** Never commit API keys; use `local.properties` (Kotlin) or `.env` (React)
3. **Testing:** Mock AI responses during development; real API calls should be rate-limited
4. **Signing:** Android release builds require keystore at `distribution/android/keystore/keystore.properties`
5. **Database Migrations:** Room database is at v2; uninstall/reinstall app during development if migration issues occur

## Custom Gradle Tasks

The Kotlin project includes custom Gradle scripts:
- `gradle/scripts/refactorPackage.gradle.kts` - Package renaming utilities
- `gradle/scripts/generateNewScreen.gradle.kts` - Screen boilerplate generation

## Documentation References

- **PRD:** N8ture AI App_MVP_PRD.md (full product requirements)
- **Implementation Guide:** N8ture AI App_Implementation_Guide.md (code structure details)
- **API Migration:** AppStructure_PRD.md (Replicate → Gemini migration plan)
- **User Flow:** N8ture AI App_User_Flow.md (user journey diagrams)
- **React App Docs:** USER_GUIDE.md, DEPLOYMENT_GUIDE.md (in React app directory)

## Platform-Specific Notes

### Android
- Minimum SDK 24 (Android 7.0), Target SDK 35
- Camera permission (required), Location (optional), Photo library (optional)
- Firebase services: Messaging, Analytics, Crashlytics, Remote Config
- AdMob integration for ads (debug uses test IDs)

### iOS
- Minimum iOS 14.0, Target iOS 17.0
- Uses SwiftUI integration via Kotlin framework
- StoreKit 2 for subscriptions
- Push notifications via KMP Notifier

### Web (React)
- Modern browsers only (ES6+)
- Desktop and mobile responsive
- No native camera access (uses file upload)