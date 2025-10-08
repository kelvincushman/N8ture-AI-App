# N8ture AI App Quick Start Checklist

Complete these steps to get N8ture AI App running.

## ☑️ Phase 1: Initial Setup (10 minutes)

### System Requirements
- [ ] JDK 17+ installed (`java -version`)
- [ ] Android Studio Hedgehog (2023.1.1) or later
- [ ] For iOS: Xcode 15+ (macOS only)
- [ ] Run `kdoctor` and fix any issues

### Project Setup
```bash
cd "/home/ubuntu-server/dev/WalkersApp/Walker App/KAppMakerExtended-main"
```

- [ ] Copy config template
```bash
cp local.properties.template local.properties
```

- [ ] Add Android SDK path to `local.properties`
```properties
sdk.dir=/path/to/Android/sdk
```

## ☑️ Phase 2: Get API Keys (15 minutes)

### Gemini API (REQUIRED - Free)
- [ ] Go to https://ai.google.dev/
- [ ] Click "Get API Key"
- [ ] Create new project or select existing
- [ ] Copy API key
- [ ] Add to `local.properties`:
```properties
GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE
```

### Temporary Values (For Initial Build)
- [ ] Add these test values to `local.properties`:
```properties
GOOGLE_WEB_CLIENT_ID=test_client_id
REVENUECAT_ANDROID_API_KEY=test_key
REVENUECAT_IOS_API_KEY=test_key
ADMOB_APP_ID_ANDROID=
ADMOB_BANNER_AD_ID_ANDROID=
ADMOB_INTERSTITIAL_AD_ID_ANDROID=
ADMOB_REWARDED_AD_ID_ANDROID=
ADMOB_BANNER_AD_ID_IOS=
ADMOB_INTERSTITIAL_AD_ID_IOS=
ADMOB_REWARDED_AD_ID_IOS=
```

**Note:** App will build and identification will work. Auth/subscriptions won't work until properly configured.

## ☑️ Phase 3: First Build (5 minutes)

### Android Build
```bash
./gradlew :composeApp:assembleDebug
```

- [ ] Build succeeds
- [ ] Find APK at: `composeApp/build/outputs/apk/debug/composeApp-debug.apk`

### Common Build Issues

**Issue:** `JAVA_HOME not set`
```bash
export JAVA_HOME=/path/to/jdk17
```

**Issue:** `SDK location not found`
- Ensure `sdk.dir` in `local.properties` points to Android SDK

**Issue:** `Gemini API key missing`
- Check `GEMINI_API_KEY` is set in `local.properties`

## ☑️ Phase 4: Firebase Setup (20 minutes)

Only needed for authentication, cloud storage, and analytics.

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com
- [ ] Click "Add Project"
- [ ] Name: "N8ture AI App" (or your choice)
- [ ] Disable Google Analytics (or enable if you want)
- [ ] Click "Create Project"

### Add Android App
- [ ] In Firebase Console, click "Add app" → Android
- [ ] Package name: `com.measify.kappmaker`
- [ ] App nickname: "N8ture AI App Android"
- [ ] Click "Register app"
- [ ] Download `google-services.json`
- [ ] Move file to: `composeApp/google-services.json`

### Add iOS App (Optional - If building iOS)
- [ ] In Firebase Console, click "Add app" → iOS
- [ ] Bundle ID: `com.measify.kappmaker`
- [ ] App nickname: "N8ture AI App iOS"
- [ ] Click "Register app"
- [ ] Download `GoogleService-Info.plist`
- [ ] Move file to: `iosApp/iosApp/GoogleService-Info.plist`

### Enable Firebase Services
- [ ] **Authentication:**
  - Go to "Authentication" in Firebase Console
  - Click "Get Started"
  - Enable "Google" sign-in provider
  - Add your OAuth client IDs

- [ ] **Firestore Database:**
  - Go to "Firestore Database"
  - Click "Create Database"
  - Start in test mode (for development)
  - Choose location closest to you

- [ ] **Storage:**
  - Go to "Storage"
  - Click "Get Started"
  - Use default settings

### Update local.properties with Firebase
- [ ] Get Web Client ID from Firebase:
  - Go to Project Settings → General
  - Scroll to "Your apps" → Web API Key
  - Copy Web Client ID
- [ ] Update `local.properties`:
```properties
GOOGLE_WEB_CLIENT_ID=YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com
```

## ☑️ Phase 5: RevenueCat Setup (15 minutes)

Only needed for subscription payments.

### Create RevenueCat Account
- [ ] Go to https://www.revenuecat.com
- [ ] Sign up (free for <$10k MRR)
- [ ] Create new project: "N8ture AI App"

### Add Android App
- [ ] In RevenueCat dashboard, click "Apps" → "Add App"
- [ ] Platform: Android
- [ ] Name: "N8ture AI App Android"
- [ ] Package name: `com.measify.kappmaker`
- [ ] Copy "Public SDK Key"
- [ ] Update `local.properties`:
```properties
REVENUECAT_ANDROID_API_KEY=YOUR_ACTUAL_ANDROID_KEY
```

### Add iOS App (Optional)
- [ ] Click "Add App" → iOS
- [ ] Name: "N8ture AI App iOS"
- [ ] Bundle ID: `com.measify.kappmaker`
- [ ] Copy "Public SDK Key"
- [ ] Update `local.properties`:
```properties
REVENUECAT_IOS_API_KEY=YOUR_ACTUAL_IOS_KEY
```

### Configure Products
- [ ] In RevenueCat, go to "Products"
- [ ] Create monthly product:
  - Identifier: `n8ture_premium_monthly`
  - Price: $4.99/month
- [ ] Create annual product:
  - Identifier: `n8ture_premium_annual`
  - Price: $39.99/year

## ☑️ Phase 6: Test Build (5 minutes)

### Rebuild with Real Config
```bash
./gradlew clean
./gradlew :composeApp:assembleDebug
```

- [ ] Build succeeds with all real API keys
- [ ] Install APK on device/emulator
- [ ] App launches without crashes

## ☑️ Phase 7: Test Core Features

### Test Trial System
- [ ] Launch app
- [ ] See "3 Free IDs Remaining" banner
- [ ] Trial counter shows correct count

### Test Identification (Requires Implementation)
Once screens are implemented:
- [ ] Take/upload photo of plant
- [ ] See loading indicator
- [ ] See identification result with confidence
- [ ] See safety indicator (color-coded)
- [ ] Result saved to history
- [ ] Trial count decremented

### Test Database
- [ ] Identifications persist after app restart
- [ ] Favorites work
- [ ] Search works
- [ ] History shows recent identifications

## 📋 Configuration Summary

At minimum, you need:
- ✅ `GEMINI_API_KEY` (REQUIRED - for identification)
- ✅ `sdk.dir` (REQUIRED - for building)
- ⏳ `GOOGLE_WEB_CLIENT_ID` (for Google Sign-In)
- ⏳ `REVENUECAT_*_API_KEY` (for subscriptions)
- ⏳ Firebase config files (for cloud features)

**You can build and test identification with just the first two!**

## 🚨 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
./gradlew clean
./gradlew :composeApp:assembleDebug

# Check system
kdoctor

# Verify JDK
java -version  # Should be 17+
```

### Gemini API Errors
- Check API key is correct in `local.properties`
- Verify API key is enabled at https://ai.google.dev/
- Check quota limits (60 req/min, 1500/day free tier)

### Firebase Connection Issues
- Verify `google-services.json` is in `composeApp/`
- Check package name matches: `com.measify.kappmaker`
- Rebuild after adding Firebase files

### Room Database Errors
- Uninstall and reinstall app (dev only)
- Database will auto-migrate to v2

## 📚 Next Steps

After completing this checklist:

1. **Implement Screens** (See `/docs/IMPLEMENTATION_STATUS.md`)
   - Start with CameraScreen.kt
   - Then ResultsScreen.kt
   - Use existing components (TrialCounter, SafetyIndicator, etc.)

2. **Wire Up Navigation**
   - Add routes to nav graph
   - Connect screens

3. **Test End-to-End**
   - Capture photo → Identify → View result → Save → History

4. **Polish**
   - Loading states
   - Error handling
   - Animations
   - Empty states

## 🎯 Success Criteria

You're ready to develop when:
- [x] App builds successfully
- [x] Gemini API key works (test with curl if needed)
- [x] Trial system shows correct count
- [x] Database saves/retrieves data
- [x] UI components render correctly

## 📞 Getting Help

- **Build Issues:** Check `/docs/BUILD_SUMMARY.md`
- **Architecture Questions:** See `/CLAUDE.md`
- **API Integration:** See `GeminiApiService.kt` KDoc
- **UI Components:** See component files in `presentation/components/`

---

**Estimated Total Setup Time:** 1-2 hours (depending on API signup wait times)

**Next:** After setup, follow `/docs/IMPLEMENTATION_STATUS.md` for screen implementation.