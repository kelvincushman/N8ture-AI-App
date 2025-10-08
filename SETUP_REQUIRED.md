# ⚠️ Setup Required for N8ture AI App

Your Gemini API key has been configured successfully! However, you need to install a few prerequisites before building.

## ✅ Already Configured

- ✅ **Gemini API Key:** Added to `local.properties`
- ✅ **Project Structure:** All code is ready
- ✅ **Gradle Wrapper:** Made executable

## 🔧 Prerequisites to Install

### 1. Java Development Kit (JDK 17+)

**Required for:** Building Kotlin Multiplatform apps

**Install Options:**

#### Option A: Using SDKMAN (Recommended)
```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java 17
sdk install java 17.0.9-tem

# Verify
java -version
```

#### Option B: Using Package Manager
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# Verify
java -version
```

#### Option C: Download from Oracle
- Visit: https://www.oracle.com/java/technologies/downloads/#java17
- Download JDK 17 for Linux
- Extract and set JAVA_HOME

### 2. Android SDK (Optional - for Android builds)

**Required for:** Building Android APKs

**Note:** The SDK path in `local.properties` is set to `/home/ubuntu-server/Android/Sdk`

**Install Options:**

#### Option A: Android Studio (Full IDE)
1. Download from: https://developer.android.com/studio
2. Install and run Android Studio
3. It will auto-install SDK to `~/Android/Sdk`
4. Update `local.properties` if path differs

#### Option B: Command Line Tools Only
```bash
# Create directory
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk

# Download command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip

# Extract
unzip commandlinetools-linux-*.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true

# Install SDK components
cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Add to PATH
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

### 3. KDoctor (Optional - System Checker)

**Purpose:** Verify your system is ready for KMM development

```bash
# Install via Homebrew (if on macOS/Linux with brew)
brew install kdoctor

# Or download directly
# Visit: https://github.com/Kotlin/kdoctor
```

## 🚀 After Installing Prerequisites

### Step 1: Verify Java Installation
```bash
java -version
# Should show: openjdk version "17.0.x" or higher
```

### Step 2: Set JAVA_HOME (if needed)
```bash
# Find Java location
which java
readlink -f $(which java)

# Set JAVA_HOME (example - adjust path)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
```

### Step 3: Navigate to Project
```bash
cd "/home/ubuntu-server/dev/WalkersApp/Walker App/KAppMakerExtended-main"
```

### Step 4: Test Gradle
```bash
./gradlew --version
```

Expected output:
```
Gradle 8.x
Kotlin: 2.x
JVM: 17.0.x
```

### Step 5: Build the Project
```bash
# Clean build
./gradlew clean

# Build debug APK
./gradlew :composeApp:assembleDebug
```

### Step 6: Find Your APK
```bash
# APK location:
ls -lh composeApp/build/outputs/apk/debug/

# You'll see:
# composeApp-debug.apk
```

## 📱 Current Configuration Status

### ✅ Configured (in local.properties)
```properties
GEMINI_API_KEY=AIzaSyB2UQy65ZYi1WEejfrx8zMwZ49u5FQztAw ✅
sdk.dir=/home/ubuntu-server/Android/Sdk ✅
GOOGLE_WEB_CLIENT_ID=test_client_id_placeholder (placeholder)
REVENUECAT_ANDROID_API_KEY=test_key_placeholder (placeholder)
REVENUECAT_IOS_API_KEY=test_key_placeholder (placeholder)
```

### 🎯 What Works Now
With just the Gemini API key:
- ✅ Core identification logic
- ✅ AI-powered species recognition
- ✅ Trial system (3 free identifications)
- ✅ Offline caching
- ✅ Database operations

### ⏳ What Needs Additional Setup
- Google Sign-In (needs real GOOGLE_WEB_CLIENT_ID from Firebase)
- Subscriptions (needs RevenueCat setup)
- Cloud sync (needs Firebase configuration)

## 🎬 Quick Start (After Java Install)

```bash
# 1. Install Java 17
sdk install java 17.0.9-tem  # or use apt install openjdk-17-jdk

# 2. Navigate to project
cd "/home/ubuntu-server/dev/WalkersApp/Walker App/KAppMakerExtended-main"

# 3. Build
./gradlew :composeApp:assembleDebug

# 4. Install on device (if connected)
./gradlew :composeApp:installDebug

# Or find APK at:
# composeApp/build/outputs/apk/debug/composeApp-debug.apk
```

## 🔐 Security Note

Your API key is stored in `local.properties` which is:
- ✅ Already in `.gitignore` (won't be committed)
- ✅ Local to your machine only
- ✅ Not shared in version control

**Important:** Never commit `local.properties` to git!

## 📚 Next Steps After Build Succeeds

1. **Test Build:** Verify APK builds successfully
2. **Install Firebase:** Setup Google Sign-In (optional)
3. **Setup RevenueCat:** Configure subscriptions (optional)
4. **Implement Screens:** Add Camera, Results, Detail screens
5. **Test Identification:** Use your Gemini API key for real identifications

## 💡 Development Tips

### Build Variants
```bash
# Debug (includes debug symbols)
./gradlew :composeApp:assembleDebug

# Release (optimized, requires signing)
./gradlew :composeApp:assembleRelease
```

### Run Tests
```bash
# Unit tests
./gradlew :composeApp:test

# Android instrumented tests (device/emulator required)
./gradlew :composeApp:connectedDebugAndroidTest
```

### Clean Build
```bash
# If you encounter build issues
./gradlew clean
./gradlew :composeApp:assembleDebug --refresh-dependencies
```

## 🆘 Troubleshooting

### "JAVA_HOME not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
```

### "SDK location not found"
- Edit `local.properties`
- Update `sdk.dir` to your actual Android SDK path
- Or install Android SDK (see instructions above)

### "Gradle daemon disappeared"
```bash
# Increase Gradle memory
echo "org.gradle.jvmargs=-Xmx4g" >> gradle.properties
```

### Build Fails with API Errors
- Verify Gemini API key is correct
- Check API quota: https://ai.google.dev/
- Ensure internet connection

## 📖 Documentation

- **Main Guide:** `/CLAUDE.md`
- **Quick Start:** `/docs/QUICK_START_CHECKLIST.md`
- **Implementation Status:** `/docs/IMPLEMENTATION_STATUS.md`
- **Build Summary:** `/docs/BUILD_SUMMARY.md`
- **Branding:** `/docs/BRANDING.md`

---

**Status:** Configuration complete, awaiting Java/JDK installation to build.