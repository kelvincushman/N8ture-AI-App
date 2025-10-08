# 🌿 N8ture AI App - Wildlife & Plant Identification

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/Kotlin-2.1.0-purple" alt="Kotlin" />
  <img src="https://img.shields.io/badge/Compose%20Multiplatform-1.7.0-green" alt="Compose" />
  <img src="https://img.shields.io/badge/React-19-cyan" alt="React" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
</p>

<p align="center">
  <strong>AI-powered species identification app for wildlife, plants, and fungi</strong><br>
  Get instant species identification with safety warnings, edibility information, and herbal benefits
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Implementation Status](#-implementation-status)
- [Business Model](#-business-model)
- [API Integration](#-api-integration)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**N8ture AI App** is a cross-platform mobile application that uses advanced AI to identify species from photos. Whether you're a nature enthusiast, forager, or outdoor adventurer, this app helps you safely identify plants, animals, and fungi with confidence.

### Why N8ture AI?

- 🤖 **AI-Powered**: Google Gemini Vision API for accurate species identification
- 🔒 **Safety First**: Clear safety indicators for edibility and toxicity
- 📱 **Cross-Platform**: Native iOS & Android apps using Kotlin Multiplatform
- 🌐 **Web Prototype**: React-based web version for testing and development
- 💰 **Freemium Model**: 3 free identifications, with premium subscriptions available

---

## ✨ Features

### 🆓 Free Tier
- 3 lifetime identifications
- Basic species information
- Safety warnings (edible/poisonous)
- Confidence scoring
- Common and scientific names

### 💎 Premium ($4.99/month or $39.99/year)
- ✅ Unlimited identifications
- 📸 High-resolution image capture
- 📍 Location tracking and mapping
- 🗺️ Detailed habitat information
- 🌿 Medicinal and herbal benefits
- 👨‍🍳 Cooking methods and recipes
- 📴 Offline mode (50 species cache)
- 📊 Export identification history
- 🔔 Priority support

### 🔍 Identification Categories
- 🌱 **Plants**: Trees, flowers, shrubs, grasses
- 🦌 **Wildlife**: Mammals, birds, reptiles, amphibians
- 🍄 **Fungi**: Mushrooms, lichens, molds
- 🐛 **Insects**: Butterflies, beetles, spiders

### 🛡️ Safety Indicators
- 🟢 **Safe/Edible**: Confirmed safe for consumption
- 🟡 **Caution**: Edible with proper preparation/cooking
- 🔴 **Dangerous/Poisonous**: Toxic or harmful
- ⚪ **Unknown**: Insufficient data for determination

---

## 📁 Project Structure

This repository contains **two parallel implementations**:

```
N8ture-AI-App/
│
├── Walker App/KAppMakerExtended-main/          # 📱 Production: Kotlin Multiplatform Mobile
│   ├── composeApp/                             # Main app module
│   │   ├── src/commonMain/                     # Shared Kotlin code
│   │   │   ├── domain/                         # Business logic & models
│   │   │   ├── data/                           # Repositories & data sources
│   │   │   └── presentation/                   # UI screens & components
│   │   ├── src/androidMain/                    # Android-specific code
│   │   └── src/iosMain/                        # iOS-specific code
│   ├── iosApp/                                 # iOS native wrapper
│   └── designsystem/                           # Shared design system
│
├── AI App for.../wildlife-id-app-complete/     # 🌐 Web Prototype: React + Flask
│   └── wildlife-id-app/
│       ├── src/                                # React frontend
│       │   ├── components/ui/                  # shadcn/ui components
│       │   └── App.jsx                         # Main app logic
│       └── backend/                            # Flask backend (mock AI)
│           └── app.py                          # API endpoints
│
├── CLAUDE.md                                   # 🤖 Developer guide for Claude Code
├── README.md                                   # 📖 This file
├── N8ture AI App_MVP_PRD.md                   # Product requirements
├── N8ture AI App_Implementation_Guide.md      # Technical implementation details
└── AppStructure_PRD.md                        # API migration guide (Replicate → Gemini)
```

---

## 🛠️ Tech Stack

### Kotlin Multiplatform Mobile (Production App)

| Component | Technology |
|-----------|-----------|
| **Platform** | Kotlin Multiplatform Mobile (KMM) |
| **UI Framework** | Compose Multiplatform + Material Design 3 |
| **Backend** | Firebase (Auth, Firestore, Storage, Analytics, Crashlytics) |
| **AI Engine** | Google Gemini Vision API |
| **Database** | Room (SQLite) with multiplatform support |
| **Networking** | Ktor Client |
| **Dependency Injection** | Koin |
| **Subscriptions** | RevenueCat (StoreKit 2 for iOS, Google Play Billing 5 for Android) |
| **Image Loading** | Coil (Compose) |
| **Serialization** | Kotlinx Serialization |

**Platform Targets:**
- Android: Min SDK 24 (Android 7.0), Target SDK 35
- iOS: Min iOS 14.0, Target iOS 17.0

### React Web Prototype

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19 + Vite |
| **UI Library** | shadcn/ui (Radix UI primitives) |
| **Styling** | Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **Forms** | React Hook Form + Zod validation |
| **Backend** | Flask (Python 3) |
| **Package Manager** | pnpm 10.4.1 |

---

## 🚀 Getting Started

### Prerequisites

#### For Kotlin App:
- ☕ **JDK 17 or higher**
- 🤖 **Android Studio Hedgehog (2023.1.1)** or later
- 🍎 **Xcode 15+** (for iOS development, macOS only)
- 🔧 **kdoctor** (for system verification)

#### For React Prototype:
- 📦 **Node.js 18+**
- 🔥 **pnpm 10.4.1**
- 🐍 **Python 3.8+**

---

### 📱 Kotlin Multiplatform Setup

#### 1. Navigate to Project Directory
```bash
cd "Walker App/KAppMakerExtended-main"
```

#### 2. Configure API Keys

Copy the template and add your credentials:
```bash
cp local.properties.template local.properties
```

Edit `local.properties`:
```properties
sdk.dir=/path/to/Android/sdk

# Google Gemini API (https://ai.google.dev/)
GEMINI_API_KEY=your_gemini_api_key

# Firebase Web Client ID
GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com

# RevenueCat API Keys (https://revenuecat.com/)
REVENUECAT_ANDROID_API_KEY=your_android_key
REVENUECAT_IOS_API_KEY=your_ios_key

# AdMob IDs (optional)
ADMOB_APP_ID_ANDROID=ca-app-pub-xxx
ADMOB_BANNER_AD_ID_ANDROID=ca-app-pub-xxx
ADMOB_INTERSTITIAL_AD_ID_ANDROID=ca-app-pub-xxx
ADMOB_REWARDED_AD_ID_ANDROID=ca-app-pub-xxx
ADMOB_BANNER_AD_ID_IOS=ca-app-pub-xxx
ADMOB_INTERSTITIAL_AD_ID_IOS=ca-app-pub-xxx
ADMOB_REWARDED_AD_ID_IOS=ca-app-pub-xxx
```

#### 3. Firebase Configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add Android app with package `com.measify.kappmaker`
3. Add iOS app with bundle ID `com.measify.kappmaker`
4. Download configuration files:
   - `google-services.json` → Place in `composeApp/`
   - `GoogleService-Info.plist` → Place in `iosApp/iosApp/`

#### 4. RevenueCat Setup (Optional)

1. Create account at [revenuecat.com](https://revenuecat.com)
2. Configure products:
   - `wildid_premium_monthly` - $4.99/month
   - `wildid_premium_annual` - $39.99/year
3. Add API keys to `local.properties`

#### 5. Build the App

**Android:**
```bash
# Build debug APK
./gradlew :composeApp:assembleDebug

# Output: composeApp/build/outputs/apk/debug/composeApp-debug.apk

# Run on connected device
./gradlew :composeApp:installDebug

# Run tests
./gradlew :composeApp:connectedDebugAndroidTest
```

**iOS (macOS only):**
```bash
cd iosApp
pod install
open iosApp.xcworkspace
```

Or use the Kotlin Multiplatform Mobile plugin in Android Studio.

---

### 🌐 React Web Prototype Setup

#### 1. Navigate to Project Directory
```bash
cd "AI App for Identifying Wildlife, Plants, and Edibility/wildlife-id-app-complete/wildlife-id-app"
```

#### 2. Install Dependencies
```bash
# Frontend
pnpm install

# Backend
cd backend
pip3 install -r requirements.txt
cd ..
```

#### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
python3 app.py
# Backend runs at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
# Frontend runs at http://localhost:5173

# For network access:
pnpm dev -- --host
```

#### 4. Build for Production
```bash
pnpm build
pnpm preview
```

---

## 🔨 Development

### Cleaning & Troubleshooting

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

### Testing Commands

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

### Code Architecture

#### Domain Layer (Business Logic)
```kotlin
// Species identification use case
val result = identifySpeciesUseCase(
    imageData = capturedImage,
    category = SpeciesCategory.PLANT,
    isSubscribed = user.isPremium
)

result.onSuccess { identification ->
    val confidence = identification.primaryMatch.getConfidencePercentage() // 85%
    val species = identification.primaryMatch.species
    val safety = species.edibility // EDIBLE, POISONOUS, etc.
}
```

#### Trial Management
```kotlin
val trialState = trialManager.getTrialState()
// TrialState(remainingIdentifications=3, isTrialExpired=false)

if (trialManager.canIdentify()) {
    trialManager.useTrialIdentification()
    // Proceed with identification
}
```

#### UI Components
```kotlin
// Display safety indicator
SafetyIndicator(
    edibilityStatus = species.edibility,
    showLabel = true
)

// Confidence badge
ConfidenceBadge(confidenceScore = 0.85f)

// Trial counter
TrialCounter(remainingCount = 2)
```

---

## 📊 Implementation Status

### ✅ Completed (Kotlin App)
- [x] Domain models (Species, IdentificationResult, TrialState)
- [x] Room database v2 with migration
- [x] Gemini API service with image identification
- [x] Repository pattern with trial management
- [x] Use cases (Identify, History, Favorites, Search)
- [x] UI components (TrialCounter, SafetyIndicator, ConfidenceBadge, SafetyBadge)
- [x] Freemium trial logic (3 free identifications)
- [x] Firebase integration (Auth, Firestore, Analytics, Crashlytics)

### 🚧 In Progress
- [ ] Camera capture screens (Android/iOS platform-specific)
- [ ] Identification results screen
- [ ] Species detail screen with tabs (Overview, Details, Similar Species)
- [ ] History and favorites screens
- [ ] Updated paywall screen
- [ ] Navigation graph integration
- [ ] Koin DI module configuration
- [ ] Offline caching implementation

### ✅ React Prototype Status
- [x] Fully functional web-based proof-of-concept
- [x] Mock AI backend with European species database
- [x] Complete UI with shadcn/ui components
- [x] Identification flow and results display

---

## 💰 Business Model

### Freemium Pricing Strategy

| Feature | Free | Premium |
|---------|------|---------|
| **Identifications** | 3 lifetime | Unlimited |
| **Image Quality** | Standard | High-resolution |
| **Species Info** | Basic | Detailed + Habitat |
| **Safety Warnings** | ✅ | ✅ |
| **Edibility Info** | Basic | + Cooking methods |
| **Herbal Benefits** | ❌ | ✅ |
| **Offline Mode** | ❌ | ✅ (50 species cache) |
| **Location Tracking** | ❌ | ✅ |
| **Export History** | ❌ | ✅ |
| **Priority Support** | ❌ | ✅ |
| **Price** | Free | $4.99/month or $39.99/year |

### Revenue Streams
- **Subscriptions**: Primary revenue via RevenueCat
- **Ads**: AdMob integration for free tier users (optional)
- **In-App Purchases**: Future: Field guide packs, region-specific databases

---

## 🤖 API Integration

### Current: Google Gemini Vision API

**Why Gemini?**
- High accuracy for image recognition
- Built-in multimodal understanding
- Cost-effective pricing
- Generous free tier for development

**Implementation:**
```kotlin
// GeminiApiService.kt
suspend fun identifySpecies(
    imageData: ByteArray,
    category: SpeciesCategory
): Result<GeminiIdentifyResponse>
```

### Previous: Replicate API

The project is **migrating from Replicate to Gemini** (see `AppStructure_PRD.md`).

### Future: On-Device Models

- **Fallback Option**: TensorFlow Lite models for offline identification
- **Privacy**: No data leaves the device
- **Performance**: Instant results without network latency

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | Developer guide for Claude Code (commands, architecture) |
| [N8ture AI App_MVP_PRD.md](N8ture%20AI%20App_MVP_PRD.md) | Product requirements document (freemium model) |
| [N8ture AI App_Implementation_Guide.md](N8ture%20AI%20App_Implementation_Guide.md) | Technical implementation details |
| [AppStructure_PRD.md](AppStructure_PRD.md) | API migration guide (Replicate → Gemini) |
| [Walker App/KAppMakerExtended-main/README.md](Walker%20App/KAppMakerExtended-main/README.md) | Kotlin app specific documentation |

---

## 🔐 Security & Privacy

### Security Best Practices
- ✅ Never commit API keys or credentials
- ✅ Use `local.properties` for sensitive configuration
- ✅ Firebase Remote Config for production keys
- ✅ Implement server-side verification for premium features
- ✅ Use ProGuard/R8 for Android release builds

### Privacy Notes
- Trial counts stored locally (can be reset by reinstall)
- Consider server-side trial management for production
- User photos are processed via API (not stored permanently)
- Location data only collected with user permission (premium)

---

## 🤝 Contributing

We welcome contributions! Here's how:

### 1. Fork the Repository
```bash
git clone https://github.com/kelvincushman/N8ture-AI-App.git
cd N8ture-AI-App
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes
- Follow existing code style and architecture
- Add tests for new features
- Update documentation as needed

### 4. Commit Your Changes
```bash
git commit -m 'Add amazing feature'
```

### 5. Push to Your Fork
```bash
git push origin feature/amazing-feature
```

### 6. Open a Pull Request
Submit a PR with:
- Clear description of changes
- Screenshots/videos (for UI changes)
- Test results

### Contribution Guidelines
- **Code Style**: Follow Kotlin/Compose conventions
- **Commit Messages**: Use conventional commits format
- **Testing**: Ensure all tests pass before submitting
- **Documentation**: Update relevant docs

---

## 🐛 Troubleshooting

### Build Fails

**Problem**: Gradle build errors
```bash
# Solution: Clean and rebuild
./gradlew clean
./gradlew :composeApp:assembleDebug
```

**Problem**: JDK version mismatch
```bash
# Check version (must be 17+)
java -version

# Set correct JDK in Android Studio:
# File → Project Structure → SDK Location → JDK Location
```

### API Errors

**Problem**: Gemini API authentication fails
- Verify `GEMINI_API_KEY` in `local.properties`
- Check API quota at https://ai.google.dev/
- Ensure API key has correct permissions

**Problem**: Image upload fails
- Ensure image size < 1MB (compress before upload)
- Check network connectivity
- Verify API endpoint is reachable

### Database Issues

**Problem**: Room migration errors
```bash
# Development only: Uninstall and reinstall app
adb uninstall com.measify.kappmaker
./gradlew :composeApp:installDebug
```

**Production**: Implement proper migration strategy in `AppDatabase.kt`

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses
- Compose Multiplatform - Apache 2.0
- Ktor - Apache 2.0
- Koin - Apache 2.0
- Room - Apache 2.0
- RevenueCat - MIT
- shadcn/ui - MIT

---

## 🙏 Acknowledgments

- [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) - Cross-platform UI framework
- [Google Gemini API](https://ai.google.dev/) - AI-powered species identification
- [RevenueCat](https://www.revenuecat.com/) - Subscription management
- [KAppMaker](https://kappmaker.com/) - Base architecture and boilerplate
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components for React
- Open source community for excellent libraries and tools

---

## 📞 Support

- 📧 **Email**: support@n8ture-ai.app (placeholder)
- 🐛 **Issues**: [GitHub Issues](https://github.com/kelvincushman/N8ture-AI-App/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/kelvincushman/N8ture-AI-App/discussions)

---

## 🗺️ Roadmap

### Version 1.0 (MVP)
- [x] Core identification functionality
- [x] Freemium trial system
- [ ] Camera capture screens
- [ ] Results and detail screens
- [ ] Subscription paywall
- [ ] App Store submission

### Version 1.1
- [ ] Offline mode with cached species
- [ ] Location-based species suggestions
- [ ] History and favorites management
- [ ] Export functionality

### Version 2.0
- [ ] Field guide packs (in-app purchases)
- [ ] Community features (share discoveries)
- [ ] AR mode (point and identify)
- [ ] Social integration

### Future
- [ ] On-device ML models (TensorFlow Lite)
- [ ] Regional species databases
- [ ] Expert verification system
- [ ] Gamification (badges, achievements)

---

<p align="center">
  <strong>Built with ❤️ using Kotlin Multiplatform</strong><br>
  <sub>Made for nature enthusiasts, foragers, and outdoor adventurers</sub>
</p>

<p align="center">
  <a href="https://github.com/kelvincushman/N8ture-AI-App/stargazers">⭐ Star this repo</a> •
  <a href="https://github.com/kelvincushman/N8ture-AI-App/issues">🐛 Report Bug</a> •
  <a href="https://github.com/kelvincushman/N8ture-AI-App/issues">💡 Request Feature</a>
</p>
