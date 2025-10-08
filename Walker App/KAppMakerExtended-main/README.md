# N8ture AI App - Wildlife & Plant Identification App

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/Kotlin-2.1.0-purple" alt="Kotlin" />
  <img src="https://img.shields.io/badge/Compose%20Multiplatform-1.7.0-green" alt="Compose" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
</p>

AI-powered mobile application for identifying wildlife, plants, and fungi with safety information, edibility status, and herbal benefits.

## 🌟 Features

### Freemium Model
- **Free Tier:** 3 lifetime identifications with basic species info
- **Premium:** $4.99/month or $39.99/year
  - Unlimited identifications
  - High-resolution capture
  - Detailed habitat information
  - Medicinal/herbal uses
  - Offline mode (50 species cache)
  - Location tracking
  - Export history

### AI Identification
- Powered by Google Gemini Vision API
- Supports: Plants, Mammals, Birds, Reptiles, Insects, Fungi
- Confidence scoring (0-100%)
- Alternative match suggestions
- Safety warnings for poisonous species

### Safety Indicators
- 🟢 **Green:** Safe/Edible
- 🟡 **Yellow:** Caution/Conditional (requires preparation)
- 🔴 **Red:** Dangerous/Poisonous
- ⚪ **Gray:** Unknown/Not Applicable

## 🏗️ Architecture

### Tech Stack
- **UI:** Compose Multiplatform (Material Design 3)
- **Platform:** Kotlin Multiplatform Mobile
- **Backend:** Firebase (Auth, Firestore, Storage, Analytics)
- **AI:** Google Gemini Vision API
- **Database:** Room (SQLite) for offline caching
- **Networking:** Ktor Client
- **DI:** Koin
- **Subscriptions:** RevenueCat

### Project Structure
```
composeApp/src/
├── commonMain/          # Shared Kotlin code
│   ├── domain/
│   │   ├── model/       # Species, IdentificationResult, TrialState
│   │   └── usecase/     # Business logic use cases
│   ├── data/
│   │   ├── source/
│   │   │   ├── local/   # Room DB, TrialManager
│   │   │   └── remote/  # GeminiApiService
│   │   └── repository/  # Data coordination
│   └── presentation/
│       ├── screens/     # UI screens
│       └── components/  # Reusable UI components
├── androidMain/         # Android-specific
└── iosMain/            # iOS-specific
```

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Android Studio Hedgehog (2023.1.1) or later
- Xcode 15+ (for iOS development, macOS only)
- Run `kdoctor` to verify system setup

### Configuration

1. **Copy Configuration Template**
```bash
cp local.properties.template local.properties
```

2. **Get Required API Keys**

   **Google Gemini API:**
   - Visit https://ai.google.dev/
   - Create API key
   - Add to `local.properties`: `GEMINI_API_KEY=your_key`

   **Firebase Project:**
   - Create project at console.firebase.google.com
   - Add Android app (package: `com.measify.kappmaker`)
   - Add iOS app (bundle ID: `com.measify.kappmaker`)
   - Download config files:
     - `google-services.json` → `composeApp/`
     - `GoogleService-Info.plist` → `iosApp/iosApp/`

   **RevenueCat (Optional for subscriptions):**
   - Create account at revenuecat.com
   - Configure products: `wildid_premium_monthly`, `wildid_premium_annual`
   - Add API keys to `local.properties`

3. **Update local.properties**
```properties
sdk.dir=/path/to/Android/sdk
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
REVENUECAT_ANDROID_API_KEY=your_key
REVENUECAT_IOS_API_KEY=your_key
```

### Build & Run

#### Android
```bash
# Build debug APK
./gradlew :composeApp:assembleDebug

# Output location
# composeApp/build/outputs/apk/debug/composeApp-debug.apk

# Run tests
./gradlew :composeApp:connectedDebugAndroidTest
```

#### iOS (macOS only)
```bash
# Install dependencies
cd iosApp
pod install

# Open in Xcode
open iosApp.xcworkspace

# Or use KMM plugin in Android Studio
```

## 📱 Implementation Status

### ✅ Completed (Core Architecture)
- [x] Domain models (Species, IdentificationResult, TrialState)
- [x] Room database entities and DAOs
- [x] Gemini API service with image identification
- [x] Repository pattern with trial management
- [x] Use cases (Identify, History, Favorites, Search)
- [x] UI components (TrialCounter, SafetyIndicator, ConfidenceBadge)
- [x] Freemium trial logic (3 free identifications)

### 🚧 To Be Implemented
- [ ] Camera capture screens (Android/iOS)
- [ ] Identification results screen
- [ ] Species detail screen with tabs
- [ ] History and favorites screens
- [ ] Updated paywall screen
- [ ] Navigation graph integration
- [ ] Koin DI module setup
- [ ] Platform-specific camera implementations

See [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) for detailed progress.

## 🎯 Key Features

### Trial Management
```kotlin
val trialState = trialManager.getTrialState()
// TrialState(remainingIdentifications=3, isTrialExpired=false)

if (trialManager.canIdentify()) {
    // Perform identification
    trialManager.useTrialIdentification()
}
```

### Species Identification
```kotlin
val result = identifySpeciesUseCase(
    imageData = capturedImage,
    category = SpeciesCategory.PLANT,
    isSubscribed = user.isPremium
)

result.onSuccess { identification ->
    // Primary match with confidence
    val confidence = identification.primaryMatch.getConfidencePercentage() // 85%
    val species = identification.primaryMatch.species
    val safety = species.edibility // EDIBLE, POISONOUS, etc.
}
```

### Safety Indicators
```kotlin
// Show safety status
SafetyIndicator(
    edibilityStatus = species.edibility,
    showLabel = true
)

// Prominent badge on results
SafetyBadge(edibilityStatus = EdibilityStatus.POISONOUS)
```

## 🔐 Security Notes

- Never commit `local.properties` to version control
- API keys should be stored securely
- Consider Firebase Remote Config for production keys
- Trial counts are stored locally (can be reset by reinstall)
- Implement server-side verification for production

## 📊 Database

### Room Database v2
- **species** table - Offline species cache (last 50)
- **identification_history** table - User identification records
- Automatic migration from v1 to v2 on first launch

## 🧪 Testing

```bash
# Android instrumented tests
./gradlew :composeApp:connectedDebugAndroidTest

# iOS simulator tests
./gradlew :composeApp:iosSimulatorArm64Test

# Get signing certificate SHA1 (for Firebase)
./gradlew :composeApp:signingReport
```

## 📚 Documentation

- [CLAUDE.md](../../CLAUDE.md) - Developer guide for this repository
- [N8ture AI App_MVP_PRD.md](../../docs/N8ture AI App_MVP_PRD.md) - Product requirements
- [N8ture AI App_Implementation_Guide.md](../../docs/N8ture AI App_Implementation_Guide.md) - Technical implementation guide
- [IMPLEMENTATION_STATUS.md](../../docs/IMPLEMENTATION_STATUS.md) - Current progress

## 🔧 Troubleshooting

### Build Fails
```bash
# Clean build
./gradlew clean

# Verify system setup
kdoctor

# Check JDK version (must be 17+)
java -version
```

### API Errors
- Verify `GEMINI_API_KEY` in `local.properties`
- Check Gemini API quota: https://ai.google.dev/
- Ensure image size < 1MB (compress before upload)

### Room Migration Issues
- Uninstall app and reinstall (dev only)
- Or implement proper migration strategy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
- [Google Gemini API](https://ai.google.dev/)
- [RevenueCat](https://www.revenuecat.com/)
- [KAppMaker](https://kappmaker.com/) - Base architecture

---

**Built with ❤️ using Kotlin Multiplatform**