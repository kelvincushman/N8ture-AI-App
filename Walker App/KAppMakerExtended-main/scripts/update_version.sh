#!/bin/bash
set -e

: '
Script to automatically increment Android and iOS versionCode and optionally update versionName.
Usage:
  ./update_versions.sh [-v version_name]

Options:
  -v version_name   Set a new version name (e.g., "1.2.3").
                   If not provided, the current version name is kept.
What it does:
- Reads the current Android versionCode and versionName from build.gradle.kts.
- Increments Android versionCode by 1.
- Updates Android build file with new versionCode and versionName.
- Reads and updates iOS project version (CURRENT_PROJECT_VERSION) and marketing version (MARKETING_VERSION).
- Updates iOS Info.plist CFBundleVersion and CFBundleShortVersionString.
'

# Resolve root dir based on script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"


# Optional: pass version name as first argument
NEW_VERSION_NAME=""

# Parse arguments
while getopts "v:" opt; do
  case $opt in
    v)
      NEW_VERSION_NAME=$OPTARG
      ;;
    *)
      echo "Usage: $0 [-v new_version]"
      exit 1
      ;;
  esac
done

# -------- Android Versioning --------
ANDROID_BUILD_FILE="$ROOT_DIR/composeApp/build.gradle.kts"

if [[ ! -f "$ANDROID_BUILD_FILE" ]]; then
  echo "❌ Android build file not found at $ANDROID_BUILD_FILE"
  exit 1
fi

# Detect OS and set sed inplace edit options
if sed --version >/dev/null 2>&1; then
  # GNU sed (Linux)
  SED_INPLACE=(-i)
else
  # BSD sed (macOS)
  SED_INPLACE=(-i '')
fi

# Get current versionCode and versionName
ANDROID_VERSION_CODE=$(sed -nE 's/^[[:space:]]*versionCode = ([0-9]+).*/\1/p' "$ANDROID_BUILD_FILE")
ANDROID_VERSION_NAME=$(sed -nE 's/^[[:space:]]*versionName = "([^"]+)".*/\1/p' "$ANDROID_BUILD_FILE")


NEW_VERSION_CODE=$((ANDROID_VERSION_CODE + 1))
FINAL_VERSION_NAME=${NEW_VERSION_NAME:-$ANDROID_VERSION_NAME}

## Replace versionCode and versionName
sed "${SED_INPLACE[@]}" -E "s/^([[:space:]]*versionCode = )[0-9]+/\1$NEW_VERSION_CODE/" "$ANDROID_BUILD_FILE"
sed "${SED_INPLACE[@]}" -E "s/^([[:space:]]*versionName = \")[^\"]+(\")/\1$FINAL_VERSION_NAME\2/" "$ANDROID_BUILD_FILE"

echo "✅ Android updated:"
echo "   versionCode = $NEW_VERSION_CODE"
echo "   versionName = $FINAL_VERSION_NAME"



########################
# iOS version update
########################
IOS_PROJECT_FILE="$ROOT_DIR/iosApp/iosApp.xcodeproj/project.pbxproj"
IOS_INFO_PLIST="$ROOT_DIR/iosApp/iosApp/Info.plist"

if [[ ! -f "$IOS_PROJECT_FILE" ]]; then
  echo "❌ iOS project.pbxproj file not found at $IOS_PROJECT_FILE"
  exit 1
fi

if [[ ! -f "$IOS_INFO_PLIST" ]]; then
  echo "❌ iOS Info.plist file not found at $IOS_INFO_PLIST"
  exit 1
fi

CURRENT_IOS_VERSION_CODE=$(sed -nE 's/^[[:space:]]*CURRENT_PROJECT_VERSION = ([0-9]+);/\1/p' "$IOS_PROJECT_FILE" | head -1)
CURRENT_IOS_VERSION_NAME=$(sed -nE 's/^[[:space:]]*MARKETING_VERSION = ([^;]+);/\1/p' "$IOS_PROJECT_FILE" | head -1)

NEW_IOS_VERSION_CODE=$((CURRENT_IOS_VERSION_CODE + 1))
FINAL_IOS_VERSION_NAME=${NEW_VERSION_NAME:-$CURRENT_IOS_VERSION_NAME}

# Update project.pbxproj
sed "${SED_INPLACE[@]}" -E "s/(CURRENT_PROJECT_VERSION = )[0-9]+;/\1$NEW_IOS_VERSION_CODE;/" "$IOS_PROJECT_FILE"
sed "${SED_INPLACE[@]}" -E "s/(MARKETING_VERSION = )[^;]+;/\1$FINAL_IOS_VERSION_NAME;/" "$IOS_PROJECT_FILE"

# Update Info.plist (CFBundleVersion and CFBundleShortVersionString)
sed "${SED_INPLACE[@]}" -E "s/(<key>CFBundleVersion<\/key>[[:space:]]*<string>)[0-9]+(<\/string>)/\1$NEW_IOS_VERSION_CODE\2/" "$IOS_INFO_PLIST"
sed "${SED_INPLACE[@]}" -E "s/(<key>CFBundleShortVersionString<\/key>[[:space:]]*<string>)[^<]+(<\/string>)/\1$FINAL_IOS_VERSION_NAME\2/" "$IOS_INFO_PLIST"

echo "✅ iOS updated:"
echo "   CURRENT_PROJECT_VERSION = $NEW_IOS_VERSION_CODE"
echo "   MARKETING_VERSION = $FINAL_IOS_VERSION_NAME"
