# Mapbox Setup Guide for N8ture AI App

**Last Updated:** 2025-10-09
**Mapbox SDK Version:** 11.0.0
**Status:** Ready for implementation in Android Studio

---

## 🎯 Overview

This guide walks you through integrating Mapbox Maps into the N8ture AI App for journey tracking visualization. The implementation uses:

- **Android:** Mapbox Maps SDK for Android 11.0.0
- **iOS:** Mapbox Maps SDK for iOS 11.0.0 (via CocoaPods)
- **Style:** Outdoors v12 (optimized for hiking/nature)
- **Cost:** Free tier: 50,000 map loads/month

---

## 📋 Prerequisites

Before starting, ensure you have:
- [x] Android Studio with project open
- [x] Kotlin Multiplatform Mobile plugin installed
- [x] JDK 17 or higher
- [ ] Mapbox account (we'll create this)
- [ ] Internet connection for initial setup

---

## Step 1: Create Mapbox Account & Get Access Token

### 1.1 Sign Up

1. Go to https://account.mapbox.com/auth/signup/
2. Sign up with email or GitHub
3. Verify your email address

### 1.2 Get Your Access Token

1. Once logged in, go to https://account.mapbox.com/access-tokens/
2. You'll see a **Default public token** already created
3. Copy this token - it starts with `pk.` (public key)
4. Example: `pk.eyJ1IjoidXNlcm5hbWUiLCJhIjoiY2x4eHh4eHh4In0.xxxxxxxxxxxxx`

**Important:** This is a **public** token, safe to include in your app. Don't confuse it with secret tokens.

### 1.3 Store the Token

Add to `local.properties` (in project root):

```properties
# Mapbox Configuration
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoidXNlcm5hbWUiLCJhIjoiY2x4eHh4eHh4In0.xxxxxxxxxxxxx
```

**Note:** This file is already in `.gitignore` so your token won't be committed.

---

## Step 2: Configure Gradle Build Files

### 2.1 Update `composeApp/build.gradle.kts`

Open `Walker App/KAppMakerExtended-main/composeApp/build.gradle.kts`

Find the `kotlin { sourceSets {` section and add Mapbox dependencies:

```kotlin
kotlin {
    // ... existing configuration ...

    sourceSets {
        // ... existing sourceSets ...

        androidMain.dependencies {
            // Existing dependencies...

            // Mapbox Maps SDK
            implementation("com.mapbox.maps:android:11.0.0")

            // Optional: Mapbox Location Component (for user location)
            implementation("com.mapbox.maps:location:11.0.0")
        }

        // iOS dependencies configured via CocoaPods (see Step 3)
    }
}

// Add at the bottom of the file:
android {
    // ... existing android config ...

    defaultConfig {
        // ... existing config ...

        // Read Mapbox token from local.properties
        val properties = org.jetbrains.kotlin.konan.properties.Properties()
        properties.load(project.rootProject.file("local.properties").inputStream())

        manifestPlaceholders["MAPBOX_ACCESS_TOKEN"] =
            properties.getProperty("MAPBOX_ACCESS_TOKEN", "")
    }
}
```

### 2.2 Sync Gradle

In Android Studio:
1. Click **File → Sync Project with Gradle Files**
2. Wait for sync to complete (may take a few minutes)
3. Check for any errors in the Build Output

---

## Step 3: Configure Android

### 3.1 Update AndroidManifest.xml

Open `Walker App/KAppMakerExtended-main/composeApp/src/androidMain/AndroidManifest.xml`

Add Mapbox configuration:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Existing permissions... -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

    <!-- Add Mapbox permissions -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    <application
        android:name=".MyApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">

        <!-- Existing activities... -->

        <!-- Add Mapbox Access Token -->
        <meta-data
            android:name="MAPBOX_ACCESS_TOKEN"
            android:value="${MAPBOX_ACCESS_TOKEN}" />

    </application>

</manifest>
```

---

## Step 4: Configure iOS (Optional - if building for iOS)

### 4.1 Update Podfile

Open `Walker App/KAppMakerExtended-main/iosApp/Podfile`

Add Mapbox pod:

```ruby
target 'iosApp' do
  use_frameworks!
  platform :ios, '14.0'

  # Existing pods...

  # Mapbox Maps SDK
  pod 'MapboxMaps', '~> 11.0.0'
end
```

### 4.2 Install Pods

Open Terminal in the `iosApp` directory:

```bash
cd "Walker App/KAppMakerExtended-main/iosApp"
pod install
```

### 4.3 Configure Info.plist

Open `iosApp/iosApp/Info.plist`

Add Mapbox token:

```xml
<key>MBXAccessToken</key>
<string>$(MAPBOX_ACCESS_TOKEN)</string>

<!-- Optional: Location permissions -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to track your nature walks</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We track your location even when the app is in the background during walks</string>
```

### 4.4 Update Xcode Project Build Settings

1. Open `iosApp.xcworkspace` in Xcode
2. Select your project → Build Settings
3. Search for "User-Defined"
4. Add: `MAPBOX_ACCESS_TOKEN = your_token_here`

---

## Step 5: Create Platform-Specific Map Implementations

The common interface (`JourneyMap.kt`) is already created. Now we need platform implementations.

### 5.1 Create Android Implementation

Create file: `composeApp/src/androidMain/kotlin/com/measify/kappmaker/presentation/components/map/JourneyMap.android.kt`

```kotlin
package com.measify.kappmaker.presentation.components.map

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.MapView
import com.mapbox.maps.Style
import com.mapbox.maps.plugin.annotation.annotations
import com.mapbox.maps.plugin.annotation.generated.*
import com.measify.kappmaker.domain.model.Discovery
import com.measify.kappmaker.domain.model.GeoPoint

@Composable
actual fun JourneyMap(
    route: List<GeoPoint>,
    discoveries: List<Discovery>,
    currentLocation: GeoPoint?,
    showUserLocation: Boolean,
    zoomToRoute: Boolean,
    onMarkerClick: (Discovery) -> Unit,
    modifier: Modifier
) {
    val context = LocalContext.current
    var mapView: MapView? by remember { mutableStateOf(null) }

    AndroidView(
        factory = { ctx ->
            MapView(ctx).also { view ->
                mapView = view

                // Load Mapbox style
                view.getMapboxMap().loadStyleUri(
                    Style.OUTDOORS,
                    object : Style.OnStyleLoaded {
                        override fun onStyleLoaded(style: Style) {
                            setupMap(view, route, discoveries, currentLocation, zoomToRoute, onMarkerClick)
                        }
                    }
                )
            }
        },
        modifier = modifier.fillMaxSize()
    )

    DisposableEffect(Unit) {
        onDispose {
            mapView?.onDestroy()
        }
    }
}

private fun setupMap(
    mapView: MapView,
    route: List<GeoPoint>,
    discoveries: List<Discovery>,
    currentLocation: GeoPoint?,
    zoomToRoute: Boolean,
    onMarkerClick: (Discovery) -> Unit
) {
    val mapboxMap = mapView.getMapboxMap()

    // Draw route polyline
    if (route.isNotEmpty()) {
        val annotationApi = mapView.annotations
        val polylineManager = annotationApi.createPolylineAnnotationManager()

        val points = route.map { Point.fromLngLat(it.longitude, it.latitude) }
        val polylineOptions = PolylineAnnotationOptions()
            .withPoints(points)
            .withLineColor("#2196F3") // Blue
            .withLineWidth(5.0)
            .withLineOpacity(0.8)

        polylineManager.create(polylineOptions)

        // Zoom to fit route
        if (zoomToRoute) {
            val bounds = route.toBounds()
            bounds?.let {
                mapboxMap.setCamera(
                    CameraOptions.Builder()
                        .center(Point.fromLngLat(it.centerLng, it.centerLat))
                        .zoom(it.calculateZoomLevel())
                        .build()
                )
            }
        }
    }

    // Add discovery markers
    if (discoveries.isNotEmpty()) {
        val pointAnnotationManager = mapView.annotations.createPointAnnotationManager()

        discoveries.forEach { discovery ->
            val pointOptions = PointAnnotationOptions()
                .withPoint(Point.fromLngLat(
                    discovery.location.longitude,
                    discovery.location.latitude
                ))
                .withIconImage("marker-15") // Built-in marker
                .withTextField(discovery.getSpeciesName() ?: "Unknown")
                .withTextSize(12.0)

            val annotation = pointAnnotationManager.create(pointOptions)
        }

        // Add click listener
        pointAnnotationManager.addClickListener { annotation ->
            val index = discoveries.indexOfFirst {
                it.location.longitude == annotation.point.longitude() &&
                it.location.latitude == annotation.point.latitude()
            }
            if (index >= 0) {
                onMarkerClick(discoveries[index])
            }
            true
        }
    }

    // Add current location marker (blue dot)
    currentLocation?.let { location ->
        val circleManager = mapView.annotations.createCircleAnnotationManager()

        val circleOptions = CircleAnnotationOptions()
            .withPoint(Point.fromLngLat(location.longitude, location.latitude))
            .withCircleRadius(8.0)
            .withCircleColor("#2196F3")
            .withCircleStrokeWidth(2.0)
            .withCircleStrokeColor("#FFFFFF")

        circleManager.create(circleOptions)
    }
}
```

### 5.2 Create iOS Implementation (Placeholder)

Create file: `composeApp/src/iosMain/kotlin/com/measify/kappmaker/presentation/components/map/JourneyMap.ios.kt`

```kotlin
package com.measify.kappmaker.presentation.components.map

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.Discovery
import com.measify.kappmaker.domain.model.GeoPoint

/**
 * iOS implementation - Placeholder for now
 * Full implementation requires MapKit integration
 */
@Composable
actual fun JourneyMap(
    route: List<GeoPoint>,
    discoveries: List<Discovery>,
    currentLocation: GeoPoint?,
    showUserLocation: Boolean,
    zoomToRoute: Boolean,
    onMarkerClick: (Discovery) -> Unit,
    modifier: Modifier
) {
    // Placeholder - will implement MapKit integration
    Box(
        modifier = modifier
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                "iOS Map (Coming Soon)",
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "${route.size} GPS points • ${discoveries.size} discoveries",
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}
```

---

## Step 6: Update Journey Screens to Use Real Map

### 6.1 Update ActiveJourneyScreen.kt

Open `composeApp/src/commonMain/kotlin/com/measify/kappmaker/presentation/screens/journey/ActiveJourneyScreen.kt`

Replace the `JourneyMapPlaceholder` call with:

```kotlin
import com.measify.kappmaker.presentation.components.map.JourneyMap

// In the ActiveJourneyScreen composable, replace:
JourneyMapPlaceholder(...)

// With:
JourneyMap(
    route = journey.route,
    discoveries = recentDiscoveries,
    currentLocation = journey.route.lastOrNull(),
    showUserLocation = true,
    zoomToRoute = true,
    onMarkerClick = { discovery ->
        // TODO: Navigate to discovery detail screen
    },
    modifier = Modifier
        .fillMaxWidth()
        .weight(1f)
)
```

### 6.2 Update JourneySummaryScreen.kt

Similarly, replace the placeholder in `JourneySummaryScreen.kt`:

```kotlin
import com.measify.kappmaker.presentation.components.map.JourneyMap

// Replace placeholder with:
JourneyMap(
    route = journey.route,
    discoveries = discoveries,
    currentLocation = null,
    showUserLocation = false,
    zoomToRoute = true,
    onMarkerClick = { discovery ->
        // TODO: Navigate to discovery detail screen
    },
    modifier = Modifier
        .fillMaxWidth()
        .height(300.dp)
        .padding(16.dp)
)
```

---

## Step 7: Build and Test

### 7.1 Clean Build

In Android Studio terminal:

```bash
cd "Walker App/KAppMakerExtended-main"
./gradlew clean
```

### 7.2 Build APK

```bash
./gradlew :composeApp:assembleDebug
```

### 7.3 Run on Device/Emulator

1. Connect Android device or start emulator
2. Click **Run** (▶️) button in Android Studio
3. Or use command: `./gradlew :composeApp:installDebug`

### 7.4 Test Map Functionality

1. Navigate to journey tracking feature
2. Start a new journey
3. Verify map loads with outdoors style
4. Check that GPS points create a polyline
5. Add a discovery and verify marker appears
6. End journey and check summary map

---

## 🐛 Troubleshooting

### Issue: "Failed to load map style"

**Solution:** Check that `MAPBOX_ACCESS_TOKEN` is correctly set in `local.properties`

### Issue: Map shows blank/white screen

**Solutions:**
1. Verify internet connection (required for first load)
2. Check logcat for Mapbox errors
3. Ensure token starts with `pk.` (public token)

### Issue: Gradle sync fails

**Solutions:**
1. Check Mapbox dependency version is correct: `11.0.0`
2. Ensure internet connection for dependency download
3. Try: File → Invalidate Caches / Restart

### Issue: Polyline doesn't appear

**Solution:** Ensure route has at least 2 GeoPoints

### Issue: Markers don't show

**Solution:** Check that discoveries have valid latitude/longitude values

---

## 📊 Verify Setup Checklist

- [ ] Mapbox account created
- [ ] Access token copied from dashboard
- [ ] Token added to `local.properties`
- [ ] `composeApp/build.gradle.kts` updated with Mapbox dependency
- [ ] `AndroidManifest.xml` configured with token placeholder
- [ ] Gradle sync successful
- [ ] `JourneyMap.android.kt` created
- [ ] Journey screens updated to use `JourneyMap`
- [ ] App builds without errors
- [ ] Map displays in app
- [ ] Route polyline appears
- [ ] Discovery markers show correctly

---

## 🎉 Next Steps

Once map integration is working:

1. **Customize Map Style:** Try different Mapbox styles
2. **Add Offline Support:** Download map regions for offline use
3. **Improve Markers:** Add custom icons for different discovery types
4. **Add Map Controls:** Zoom buttons, compass, scale bar
5. **Optimize Performance:** Polyline simplification for long routes

---

## 📚 Additional Resources

- **Mapbox Android SDK Docs:** https://docs.mapbox.com/android/maps/guides/
- **Map Styles Gallery:** https://www.mapbox.com/maps
- **Mapbox Studio:** https://studio.mapbox.com/ (create custom styles)
- **Pricing Calculator:** https://www.mapbox.com/pricing
- **Support:** https://support.mapbox.com/

---

This guide should get you up and running with Mapbox maps in Android Studio. The integration is straightforward and will dramatically improve the journey tracking user experience!
