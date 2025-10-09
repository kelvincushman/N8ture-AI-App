# Map Integration Guide - Journey Tracking System

**Date:** 2025-10-09
**Phase:** 2C - Map Integration
**Status:** Planning & Implementation Guide

---

## 🗺️ Map Provider Comparison

### Option 1: Google Maps ⭐⭐⭐
**Cost:** $7/1000 map loads (after 28,000 free loads/month)

**Pros:**
- Best documentation and community support
- Familiar UI for users
- Excellent accuracy and detail
- Native Compose Multiplatform support via Google Maps Compose
- Reliable and well-maintained

**Cons:**
- Most expensive option at scale
- Requires billing account from day 1
- Requires Google Play Services (Android) - no Huawei support
- Privacy concerns for some users
- Limited customization

**Recommended For:** Apps with revenue/budget, need for reliability

---

### Option 2: Mapbox ⭐⭐⭐⭐⭐ (RECOMMENDED)
**Cost:** $0.60/1000 map loads (50,000 free loads/month)

**Pros:**
- **88% cheaper than Google Maps**
- Beautiful, customizable map styles
- Excellent offline support (download regions)
- Great documentation
- No Google Play Services dependency
- Works on Huawei devices
- Vector maps = smaller size, faster loading
- Good Kotlin Multiplatform support

**Cons:**
- Smaller community than Google Maps
- Requires API key management
- Some learning curve for customization

**Recommended For:** Production apps, cost-conscious development, offline support needed

---

### Option 3: OpenStreetMap (OSM) ⭐⭐⭐
**Cost:** Free (donations appreciated)

**Pros:**
- **100% free**
- Open-source and privacy-focused
- No API keys needed
- Community-maintained
- Highly customizable
- Works everywhere

**Cons:**
- Less polished UI than commercial options
- More setup required
- Map quality varies by region
- Requires self-hosting tiles for production (costs)
- Limited KMP support - need custom integration

**Recommended For:** MVP, privacy-focused apps, budget constraints

---

## 🎯 Decision: Mapbox

**Why Mapbox:**
1. **Cost-Effective:** 88% cheaper than Google Maps
2. **Offline Support:** Critical for nature walks in remote areas
3. **Beautiful Maps:** Better aesthetics than Google
4. **No Google Dependency:** Works on all Android devices
5. **Good KMP Support:** Available libraries for Android/iOS

---

## 📦 Mapbox Integration Plan

### Phase 2C-1: Setup & Configuration

#### 1. Add Dependencies

**Root `build.gradle.kts`:**
```kotlin
buildscript {
    dependencies {
        // No special Mapbox dependencies needed here
    }
}
```

**`composeApp/build.gradle.kts`:**
```kotlin
kotlin {
    sourceSets {
        androidMain.dependencies {
            // Mapbox SDK for Android
            implementation("com.mapbox.maps:android:11.0.0")
            implementation("com.mapbox.maps:compose:11.0.0")
        }

        iosMain.dependencies {
            // Mapbox SDK for iOS (via CocoaPods)
            // Configured in iosApp/Podfile
        }
    }
}
```

**`iosApp/Podfile`:**
```ruby
target 'iosApp' do
  use_frameworks!
  platform :ios, '14.0'

  pod 'MapboxMaps', '~> 11.0.0'
end
```

#### 2. Get Mapbox Access Token

1. Sign up at https://account.mapbox.com/
2. Get your public access token from dashboard
3. Add to `local.properties`:
   ```properties
   MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4In0.xxxxx
   ```

#### 3. Configure AndroidManifest.xml

```xml
<!-- AndroidManifest.xml -->
<manifest>
    <!-- Mapbox permissions -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    <application>
        <!-- Mapbox access token -->
        <meta-data
            android:name="MAPBOX_ACCESS_TOKEN"
            android:value="${MAPBOX_ACCESS_TOKEN}" />
    </application>
</manifest>
```

#### 4. Configure Info.plist (iOS)

```xml
<!-- Info.plist -->
<key>MBXAccessToken</key>
<string>$(MAPBOX_ACCESS_TOKEN)</string>
```

---

### Phase 2C-2: Create Map Wrapper

Since Mapbox has different APIs for Android and iOS, we need a cross-platform wrapper using `expect/actual`:

#### Common Interface

**`composeApp/src/commonMain/kotlin/com/measify/kappmaker/presentation/components/map/JourneyMap.kt`:**

```kotlin
package com.measify.kappmaker.presentation.components.map

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.measify.kappmaker.domain.model.Discovery
import com.measify.kappmaker.domain.model.GeoPoint

/**
 * Cross-platform map component for journey tracking
 * Uses Mapbox on both Android and iOS
 */
@Composable
expect fun JourneyMap(
    route: List<GeoPoint>,
    discoveries: List<Discovery> = emptyList(),
    currentLocation: GeoPoint? = null,
    showUserLocation: Boolean = true,
    zoomToRoute: Boolean = true,
    onMarkerClick: (Discovery) -> Unit = {},
    modifier: Modifier = Modifier
)

/**
 * Map configuration
 */
data class MapConfig(
    val styleUrl: String = "mapbox://styles/mapbox/outdoors-v12", // Outdoors style for nature
    val minZoom: Double = 0.0,
    val maxZoom: Double = 22.0,
    val compassEnabled: Boolean = true,
    val scaleBarEnabled: Boolean = true,
    val attributionEnabled: Boolean = true
)

/**
 * Route line style
 */
data class RouteStyle(
    val lineColor: Int = 0xFF2196F3.toInt(), // Blue
    val lineWidth: Float = 5f,
    val lineOpacity: Float = 0.8f
)

/**
 * Marker style for discoveries
 */
data class MarkerStyle(
    val iconSize: Float = 1.0f,
    val textSize: Float = 12f,
    val textColor: Int = 0xFF000000.toInt(),
    val backgroundColor: Int = 0xFFFFFFFF.toInt()
)
```

---

### Phase 2C-3: Android Implementation

**`composeApp/src/androidMain/kotlin/com/measify/kappmaker/presentation/components/map/JourneyMap.android.kt`:**

```kotlin
package com.measify.kappmaker.presentation.components.map

import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.mapbox.geojson.LineString
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.MapView
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
    val mapView = remember { MapView(context) }

    AndroidView(
        factory = { mapView },
        modifier = modifier
    ) { map ->
        // Configure map
        map.getMapboxMap().apply {
            // Set camera to show route
            if (route.isNotEmpty() && zoomToRoute) {
                val bounds = calculateBounds(route)
                setCamera(CameraOptions.Builder()
                    .center(Point.fromLngLat(bounds.centerLng, bounds.centerLat))
                    .zoom(calculateZoomLevel(bounds))
                    .build())
            }
        }

        // Draw route line
        if (route.isNotEmpty()) {
            val annotationApi = map.annotations
            val polylineManager = annotationApi.createPolylineAnnotationManager()

            val points = route.map { Point.fromLngLat(it.longitude, it.latitude) }
            val polylineOptions = PolylineAnnotationOptions()
                .withPoints(points)
                .withLineColor("#2196F3")
                .withLineWidth(5.0)

            polylineManager.create(polylineOptions)
        }

        // Add discovery markers
        discoveries.forEach { discovery ->
            val symbolManager = map.annotations.createPointAnnotationManager()

            val pointOptions = PointAnnotationOptions()
                .withPoint(Point.fromLngLat(
                    discovery.location.longitude,
                    discovery.location.latitude
                ))
                .withIconImage(discovery.getTypeIcon())
                .withTextField(discovery.getSpeciesName() ?: "Unknown")

            symbolManager.create(pointOptions)

            symbolManager.addClickListener { marker ->
                onMarkerClick(discovery)
                true
            }
        }

        // Add current location marker
        currentLocation?.let { location ->
            val symbolManager = map.annotations.createCircleAnnotationManager()

            val circleOptions = CircleAnnotationOptions()
                .withPoint(Point.fromLngLat(location.longitude, location.latitude))
                .withCircleRadius(8.0)
                .withCircleColor("#2196F3")
                .withCircleStrokeWidth(2.0)
                .withCircleStrokeColor("#FFFFFF")

            symbolManager.create(circleOptions)
        }
    }

    DisposableEffect(mapView) {
        onDispose {
            mapView.onDestroy()
        }
    }
}

private data class MapBounds(
    val minLat: Double,
    val maxLat: Double,
    val minLng: Double,
    val maxLng: Double
) {
    val centerLat = (minLat + maxLat) / 2
    val centerLng = (minLng + maxLng) / 2
}

private fun calculateBounds(route: List<GeoPoint>): MapBounds {
    return MapBounds(
        minLat = route.minOf { it.latitude },
        maxLat = route.maxOf { it.latitude },
        minLng = route.minOf { it.longitude },
        maxLng = route.maxOf { it.longitude }
    )
}

private fun calculateZoomLevel(bounds: MapBounds): Double {
    val latDiff = bounds.maxLat - bounds.minLat
    val lngDiff = bounds.maxLng - bounds.minLng
    val maxDiff = maxOf(latDiff, lngDiff)

    return when {
        maxDiff > 10 -> 4.0
        maxDiff > 5 -> 6.0
        maxDiff > 1 -> 8.0
        maxDiff > 0.5 -> 10.0
        maxDiff > 0.1 -> 12.0
        maxDiff > 0.05 -> 13.0
        maxDiff > 0.01 -> 14.0
        else -> 15.0
    }
}
```

---

### Phase 2C-4: iOS Implementation

**`composeApp/src/iosMain/kotlin/com/measify/kappmaker/presentation/components/map/JourneyMap.ios.kt`:**

```kotlin
package com.measify.kappmaker.presentation.components.map

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.interop.UIKitView
import com.measify.kappmaker.domain.model.Discovery
import com.measify.kappmaker.domain.model.GeoPoint
import kotlinx.cinterop.ExperimentalForeignApi
import platform.CoreLocation.CLLocationCoordinate2DMake
import platform.MapKit.*

@OptIn(ExperimentalForeignApi::class)
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
    val mapView = remember { MKMapView() }

    UIKitView(
        factory = {
            mapView.apply {
                // Configure map
                mapType = MKMapTypeStandard
                showsUserLocation = showUserLocation
                showsCompass = true
                showsScale = true

                // Zoom to route
                if (route.isNotEmpty() && zoomToRoute) {
                    val coordinates = route.map {
                        CLLocationCoordinate2DMake(it.latitude, it.longitude)
                    }

                    // Calculate bounding box
                    val minLat = route.minOf { it.latitude }
                    val maxLat = route.maxOf { it.latitude }
                    val minLng = route.minOf { it.longitude }
                    val maxLng = route.maxOf { it.longitude }

                    val center = CLLocationCoordinate2DMake(
                        (minLat + maxLat) / 2,
                        (minLng + maxLng) / 2
                    )

                    val span = MKCoordinateSpanMake(
                        (maxLat - minLat) * 1.2,
                        (maxLng - minLng) * 1.2
                    )

                    val region = MKCoordinateRegionMake(center, span)
                    setRegion(region, animated = true)
                }

                // Draw route polyline
                if (route.isNotEmpty()) {
                    val coordinates = route.map {
                        CLLocationCoordinate2DMake(it.latitude, it.longitude)
                    }.toTypedArray()

                    val polyline = MKPolyline.polylineWithCoordinates(
                        coordinates,
                        route.size.toULong()
                    )
                    addOverlay(polyline)
                }

                // Add discovery markers
                discoveries.forEach { discovery ->
                    val annotation = MKPointAnnotation()
                    annotation.coordinate = CLLocationCoordinate2DMake(
                        discovery.location.latitude,
                        discovery.location.longitude
                    )
                    annotation.title = discovery.getSpeciesName()
                    annotation.subtitle = discovery.type.name
                    addAnnotation(annotation)
                }
            }
        },
        modifier = modifier
    )
}
```

---

### Phase 2C-5: Update Journey Screens

Replace the `JourneyMapPlaceholder` with the actual `JourneyMap` composable:

**In `ActiveJourneyScreen.kt`:**
```kotlin
// Replace this:
JourneyMapPlaceholder(
    route = journey.route,
    discoveries = recentDiscoveries,
    modifier = Modifier
        .fillMaxWidth()
        .weight(1f)
)

// With this:
JourneyMap(
    route = journey.route,
    discoveries = recentDiscoveries,
    currentLocation = journey.route.lastOrNull(),
    showUserLocation = true,
    zoomToRoute = true,
    onMarkerClick = { discovery ->
        // Navigate to discovery detail
    },
    modifier = Modifier
        .fillMaxWidth()
        .weight(1f)
)
```

**In `JourneySummaryScreen.kt`:**
```kotlin
// Replace placeholder with:
JourneyMap(
    route = journey.route,
    discoveries = discoveries,
    currentLocation = null,
    showUserLocation = false,
    zoomToRoute = true,
    onMarkerClick = { discovery ->
        // Navigate to discovery detail
    },
    modifier = Modifier
        .fillMaxWidth()
        .height(300.dp)
        .padding(16.dp)
        .clip(RoundedCornerShape(12.dp))
)
```

---

## 🎨 Map Styles

Mapbox offers several pre-built styles for different use cases:

**For Nature/Outdoor Apps (RECOMMENDED):**
- `mapbox://styles/mapbox/outdoors-v12` - Shows trails, parks, terrain
- `mapbox://styles/mapbox/satellite-streets-v12` - Satellite with labels

**Other Options:**
- `mapbox://styles/mapbox/streets-v12` - Standard street map
- `mapbox://styles/mapbox/light-v11` - Light/minimal
- `mapbox://styles/mapbox/dark-v11` - Dark mode
- Custom styles - Design your own at Mapbox Studio

---

## 📍 Offline Maps (Future Enhancement)

Mapbox supports downloading map regions for offline use:

```kotlin
// Android
val offlineManager = OfflineManager.getInstance(context)
offlineManager.createOfflineRegion(
    definition = OfflineTilePyramidRegionDefinition(
        styleURL = "mapbox://styles/mapbox/outdoors-v12",
        bounds = LatLngBounds.from(north, east, south, west),
        minZoom = 10.0,
        maxZoom = 16.0,
        pixelRatio = resources.displayMetrics.density
    ),
    metadata = JSONObject().apply {
        put("name", "Trail Region")
    },
    callback = object : OfflineManager.CreateOfflineRegionCallback {
        override fun onCreate(offlineRegion: OfflineRegion) {
            offlineRegion.setDownloadState(OfflineRegion.STATE_ACTIVE)
        }

        override fun onError(error: String) {
            // Handle error
        }
    }
)
```

---

## 🧪 Testing Checklist

### Map Display
- [ ] Map loads correctly on Android
- [ ] Map loads correctly on iOS
- [ ] Default style (outdoors) displays properly
- [ ] Map zooms to show full route

### Route Display
- [ ] Route polyline appears in blue
- [ ] Polyline follows GPS points accurately
- [ ] Route updates in real-time during active journey
- [ ] Completed journey shows full route

### Markers
- [ ] Discovery markers appear at correct locations
- [ ] Marker icons match discovery types
- [ ] Marker labels show species names
- [ ] Tapping marker triggers callback
- [ ] Current location marker shows (blue dot)

### Performance
- [ ] Map renders smoothly with 100+ GPS points
- [ ] No lag when adding new points
- [ ] Memory usage acceptable (<50MB)
- [ ] Battery drain acceptable during tracking

### Offline
- [ ] Map tiles cache automatically
- [ ] Works without internet (after first load)
- [ ] Graceful degradation when offline

---

## 🚀 Next Steps After Phase 2C

1. **Phase 2D:** Polish & Testing
   - Unit tests for map wrapper
   - Integration tests for journey + map
   - Manual GPS accuracy testing

2. **Phase 3:** Audio Identification
   - BirdNET API integration
   - Audio recording UI
   - Sound waveform visualization

3. **Phase 4:** Full Integration
   - Connect all features
   - Navigation graph
   - Koin DI configuration
   - End-to-end testing

---

## 📚 Resources

- **Mapbox Docs:** https://docs.mapbox.com/android/maps/guides/
- **Mapbox iOS SDK:** https://docs.mapbox.com/ios/maps/guides/
- **Mapbox Compose:** https://github.com/mapbox/mapbox-maps-android-compose
- **Pricing:** https://www.mapbox.com/pricing
- **Style Studio:** https://studio.mapbox.com/

---

## 💰 Cost Estimation

**Free Tier:** 50,000 map loads/month

**Typical Usage:**
- Active journey: 1 load
- Journey summary: 1 load
- Journey history (browsing): ~5 loads

**For 1,000 active users:**
- Average 10 journeys/month = 10,000 loads
- Well within free tier

**At Scale (10,000 users):**
- 100,000 journeys/month = 100,000 loads
- 50,000 free, 50,000 paid = $30/month
- Compare to Google Maps: $350/month (11x more expensive)

---

This guide provides everything needed to implement Mapbox maps in the N8ture AI App journey tracking system!
