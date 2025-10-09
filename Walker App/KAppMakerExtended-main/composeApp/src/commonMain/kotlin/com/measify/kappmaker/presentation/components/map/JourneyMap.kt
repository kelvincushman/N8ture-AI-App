package com.measify.kappmaker.presentation.components.map

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.measify.kappmaker.domain.model.Discovery
import com.measify.kappmaker.domain.model.GeoPoint

/**
 * Cross-platform map component for journey tracking
 *
 * Uses Mapbox Maps SDK on both Android and iOS for consistent experience.
 *
 * Features:
 * - Display GPS route as polyline
 * - Show discovery markers with icons
 * - Current location indicator
 * - Zoom to fit route bounds
 * - Interactive markers
 *
 * Usage:
 * ```
 * JourneyMap(
 *     route = journey.route,
 *     discoveries = discoveries,
 *     currentLocation = journey.route.lastOrNull(),
 *     showUserLocation = true,
 *     zoomToRoute = true,
 *     onMarkerClick = { discovery -> /* Navigate to detail */ }
 * )
 * ```
 *
 * Setup Requirements:
 *
 * 1. Get Mapbox access token from https://account.mapbox.com/
 *
 * 2. Add to local.properties:
 *    ```
 *    MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4In0.xxxxx
 *    ```
 *
 * 3. Add dependencies to composeApp/build.gradle.kts:
 *    ```kotlin
 *    androidMain.dependencies {
 *        implementation("com.mapbox.maps:android:11.0.0")
 *    }
 *    ```
 *
 * 4. Configure AndroidManifest.xml:
 *    ```xml
 *    <meta-data
 *        android:name="MAPBOX_ACCESS_TOKEN"
 *        android:value="${MAPBOX_ACCESS_TOKEN}" />
 *    ```
 *
 * 5. For iOS, add to iosApp/Podfile:
 *    ```ruby
 *    pod 'MapboxMaps', '~> 11.0.0'
 *    ```
 *
 * @param route List of GPS points forming the journey route
 * @param discoveries List of discoveries to show as markers
 * @param currentLocation Current user location (shown as blue dot)
 * @param showUserLocation Whether to show user location
 * @param zoomToRoute Whether to automatically zoom to fit route
 * @param onMarkerClick Callback when discovery marker is tapped
 * @param modifier Compose modifier
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
 * Map configuration options
 */
data class MapConfig(
    /**
     * Mapbox style URL
     * Recommended: "mapbox://styles/mapbox/outdoors-v12" for nature/hiking
     */
    val styleUrl: String = "mapbox://styles/mapbox/outdoors-v12",

    /**
     * Minimum zoom level (0-22)
     */
    val minZoom: Double = 0.0,

    /**
     * Maximum zoom level (0-22)
     */
    val maxZoom: Double = 22.0,

    /**
     * Show compass control
     */
    val compassEnabled: Boolean = true,

    /**
     * Show scale bar
     */
    val scaleBarEnabled: Boolean = true,

    /**
     * Show Mapbox attribution
     */
    val attributionEnabled: Boolean = true
)

/**
 * Style configuration for route polyline
 */
data class RouteStyle(
    /**
     * Line color (ARGB format)
     */
    val lineColor: Long = 0xFF2196F3,

    /**
     * Line width in pixels
     */
    val lineWidth: Float = 5f,

    /**
     * Line opacity (0.0-1.0)
     */
    val lineOpacity: Float = 0.8f
)

/**
 * Style configuration for discovery markers
 */
data class MarkerStyle(
    /**
     * Icon size multiplier
     */
    val iconSize: Float = 1.0f,

    /**
     * Text size in sp
     */
    val textSize: Float = 12f,

    /**
     * Text color (ARGB format)
     */
    val textColor: Long = 0xFF000000,

    /**
     * Background color (ARGB format)
     */
    val backgroundColor: Long = 0xFFFFFFFF
)

/**
 * Helper function to calculate map bounds from route points
 */
fun List<GeoPoint>.toBounds(): MapBounds? {
    if (isEmpty()) return null

    return MapBounds(
        minLat = minOf { it.latitude },
        maxLat = maxOf { it.latitude },
        minLng = minOf { it.longitude },
        maxLng = maxOf { it.longitude }
    )
}

/**
 * Map bounding box
 */
data class MapBounds(
    val minLat: Double,
    val maxLat: Double,
    val minLng: Double,
    val maxLng: Double
) {
    val centerLat: Double get() = (minLat + maxLat) / 2
    val centerLng: Double get() = (minLng + maxLng) / 2
    val latSpan: Double get() = maxLat - minLat
    val lngSpan: Double get() = maxLng - minLng
}

/**
 * Calculate appropriate zoom level based on bounding box size
 */
fun MapBounds.calculateZoomLevel(): Double {
    val maxDiff = maxOf(latSpan, lngSpan)

    return when {
        maxDiff > 10 -> 4.0
        maxDiff > 5 -> 6.0
        maxDiff > 1 -> 8.0
        maxDiff > 0.5 -> 10.0
        maxDiff > 0.1 -> 12.0
        maxDiff > 0.05 -> 13.0
        maxDiff > 0.01 -> 14.0
        maxDiff > 0.005 -> 15.0
        else -> 16.0
    }
}
