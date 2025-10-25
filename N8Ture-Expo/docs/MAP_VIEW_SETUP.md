# Map View Setup Guide

## Overview

The Map View feature displays all GPS-tagged identifications on an interactive map using `react-native-maps`.

---

## Prerequisites

✅ **Already Installed**:
- `react-native-maps` - Installed during Phase 10B implementation
- `expo-location` - Already installed for GPS capture (Phase 9)

---

## Google Maps API Key Configuration

### Why API Keys Are Needed

React Native Maps requires Google Maps API keys for both iOS and Android platforms to display maps and markers.

### Step 1: Obtain Google Maps API Keys

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/

2. **Create a new project** (or select existing):
   - Project name: "N8ture AI App"

3. **Enable required APIs**:
   - Navigate to "APIs & Services" → "Library"
   - Enable the following APIs:
     - **Maps SDK for Android**
     - **Maps SDK for iOS**

4. **Create API credentials**:
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API key"
   - Create **two separate API keys**:
     - One for **Android**
     - One for **iOS**

5. **Restrict API keys** (recommended for security):

   **For Android API Key**:
   - Click "Edit" on the Android API key
   - Under "Application restrictions":
     - Select "Android apps"
     - Click "Add an item"
     - Package name: `com.n8ture.ai`
     - SHA-1 certificate fingerprint: (get from running app or keystore)
   - Under "API restrictions":
     - Select "Restrict key"
     - Select "Maps SDK for Android"
   - Click "Save"

   **For iOS API Key**:
   - Click "Edit" on the iOS API key
   - Under "Application restrictions":
     - Select "iOS apps"
     - Click "Add an item"
     - Bundle ID: `com.n8ture.ai`
   - Under "API restrictions":
     - Select "Restrict key"
     - Select "Maps SDK for iOS"
   - Click "Save"

---

### Step 2: Configure API Keys in app.json

**Edit `app.json`** and add the Google Maps API key configuration:

```json
{
  "expo": {
    "name": "N8ture AI",
    "slug": "n8ture-ai",
    "version": "1.0.0",
    // ... existing config ...

    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#708C6A"
      },
      "package": "com.n8ture.ai",
      "permissions": [
        // ... existing permissions ...
      ],
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_GOOGLE_MAPS_API_KEY"
        }
      }
    },

    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.n8ture.ai",
      "config": {
        "googleMapsApiKey": "YOUR_IOS_GOOGLE_MAPS_API_KEY"
      },
      "infoPlist": {
        // ... existing infoPlist ...
      }
    }
  }
}
```

**Replace**:
- `YOUR_ANDROID_GOOGLE_MAPS_API_KEY` with your actual Android API key
- `YOUR_IOS_GOOGLE_MAPS_API_KEY` with your actual iOS API key

---

### Step 3: Security Best Practices

⚠️ **IMPORTANT**: Never commit API keys to version control!

**Option 1: Use environment variables** (recommended)

1. Install `expo-constants`:
   ```bash
   npx expo install expo-constants
   ```

2. Create `.env` file (add to `.gitignore`):
   ```
   GOOGLE_MAPS_ANDROID_API_KEY=your_android_key_here
   GOOGLE_MAPS_IOS_API_KEY=your_ios_key_here
   ```

3. Update `app.json` to use environment variables:
   ```json
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": process.env.GOOGLE_MAPS_ANDROID_API_KEY
       }
     }
   }
   ```

**Option 2: Use `app.config.js`** instead of `app.json`

1. Rename `app.json` to `app.config.js`

2. Export configuration:
   ```javascript
   export default {
     expo: {
       // ... existing config ...
       android: {
         config: {
           googleMaps: {
             apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
           },
         },
       },
       ios: {
         config: {
           googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
         },
       },
     },
   };
   ```

---

## Testing Map View

### 1. Rebuild the App

After adding API keys, rebuild the app:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios

# For development builds
npx expo prebuild
```

### 2. Test with GPS-tagged Data

1. **Create some identifications with GPS**:
   - Open the app
   - Tap the center capture button
   - Select "Camera" mode
   - Take a photo (GPS will be captured)
   - Identify the species
   - Save to history

2. **View on map**:
   - Navigate to History tab
   - Tap "Map View" button in the view toggle bar
   - Map should display with markers at GPS locations

3. **Interact with markers**:
   - Tap a marker → Callout appears with species info
   - Tap callout → Navigates to SpeciesDetailScreen

### 3. Verify Map Features

- [ ] Map displays centered on first GPS entry
- [ ] Custom markers visible (color-coded by category)
- [ ] Markers show correct icons (🍃 plant, 🐾 wildlife, etc.)
- [ ] Callout shows species name, date, confidence
- [ ] Tap callout navigates to detail screen
- [ ] User location (blue dot) displays if permission granted
- [ ] My Location button visible (bottom right)
- [ ] Compass visible when map is rotated
- [ ] Legend shows category colors at bottom
- [ ] Header shows count of GPS-tagged entries
- [ ] Back button returns to History grid

---

## Troubleshooting

### Map Not Displaying (Blank Screen)

**Cause**: Missing or invalid API key

**Solution**:
1. Check that API keys are correctly added to `app.json`
2. Verify keys are not restricted to wrong bundle ID/package name
3. Check Google Cloud Console that APIs are enabled
4. Rebuild the app after adding keys

### "Authorization failure" Error

**Cause**: API key restrictions

**Solution**:
1. Check bundle ID matches: `com.n8ture.ai`
2. Verify SHA-1 certificate fingerprint (Android)
3. Check that correct APIs are enabled:
   - Maps SDK for Android
   - Maps SDK for iOS

### Markers Not Appearing

**Cause**: No GPS-tagged identifications in history

**Solution**:
1. Take at least one photo with GPS enabled
2. Save it to history
3. Check console logs for GPS coordinates
4. Verify `latitude` and `longitude` are not `undefined`

### Map Crashes on Android

**Cause**: Google Play Services not installed (emulator)

**Solution**:
- Use a physical Android device
- Or use an emulator with Google Play Services installed

### Map Performance Issues

**Cause**: Too many markers

**Solution** (Future enhancement):
- Implement marker clustering (Phase 10B Part 2)
- Install `react-native-map-clustering`
- Group nearby markers when zoomed out

---

## API Usage & Billing

### Free Tier Limits

Google Maps API has a generous free tier:
- **$200 free credit per month**
- Maps SDK for Android: ~28,000 map loads/month free
- Maps SDK for iOS: ~28,000 map loads/month free

### Monitor Usage

1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Dashboard"
3. View usage graphs for Maps SDK

### Cost Optimization Tips

- Set daily quotas to prevent unexpected charges
- Restrict API keys to only required APIs
- Use static map images for thumbnails (cheaper)
- Cache map tiles for offline use (future feature)

---

## Map Customization (Future Enhancements)

### Marker Clustering

For better performance with 50+ markers:

```bash
npm install react-native-map-clustering
```

```typescript
import MapView from 'react-native-map-clustering';

<MapView
  clusterColor={theme.colors.primary.main}
  clusterTextColor="#FFFFFF"
  radius={50}
  extent={512}
  // ...
/>
```

### Custom Map Styles

Apply custom styling (dark mode, muted colors):

```typescript
import { customMapStyle } from '../constants/mapStyles';

<MapView
  customMapStyle={customMapStyle}
  // ...
/>
```

### Heatmap View

Show density of identifications:

```bash
npm install react-native-maps-heatmap
```

### Region Clustering

Group identifications by geographic region (e.g., "5 species in Hyde Park")

---

## Platform-Specific Notes

### iOS

- Map provider: Apple Maps (default) or Google Maps
- No API key required for Apple Maps
- Google Maps requires iOS API key for Google Maps provider

### Android

- Map provider: Google Maps (default)
- Requires Google Maps API key
- Google Play Services must be installed

### Web

- React Native Maps not supported on web
- Use `react-google-maps` for web version instead

---

## Related Documentation

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [react-native-maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
- Phase 9 GPS Implementation: `PHASE_9_IMPLEMENTATION_PLAN.md`
- Phase 10B Plan: `PHASE_10_NEXT_FEATURES_PLAN.md`

---

## Quick Reference

### View Map
1. Navigate to History tab
2. Tap "Map View" button
3. Map displays all GPS-tagged identifications

### Marker Colors
- 🟢 **Green** (#8FAF87): Plants
- 🟤 **Brown** (#8B4513): Wildlife
- 🟠 **Orange** (#FFA500): Fungi
- 🟣 **Purple** (#9370DB): Insects
- 🔵 **Blue** (#4A90E2): Default/Other

### Map Controls
- **Pinch**: Zoom in/out
- **Two-finger drag**: Rotate map
- **Tap marker**: Show species callout
- **Tap callout**: View species detail
- **My Location button**: Center on user location
- **Compass**: Re-orient map to north

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review console logs for errors
- Verify API keys in Google Cloud Console
- Create GitHub issue with error details

---

**Last Updated**: Phase 10B Implementation
**Status**: Ready for API key configuration
