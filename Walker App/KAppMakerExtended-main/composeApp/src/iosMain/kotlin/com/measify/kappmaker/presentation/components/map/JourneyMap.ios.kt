package com.measify.kappmaker.presentation.components.map

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Map
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.Discovery
import com.measify.kappmaker.domain.model.GeoPoint

/**
 * iOS implementation of JourneyMap
 *
 * Currently shows a placeholder until MapKit integration is implemented.
 *
 * TODO: Implement using MapKit or Mapbox iOS SDK
 *
 * Future Implementation Options:
 *
 * Option 1: MapKit (Native Apple Maps)
 * - Free, no API key needed
 * - Good integration with iOS
 * - Limited customization
 *
 * Option 2: Mapbox iOS SDK
 * - Consistent with Android implementation
 * - Better customization
 * - Requires CocoaPods:
 *   ```ruby
 *   pod 'MapboxMaps', '~> 11.0.0'
 *   ```
 *
 * Implementation Guide:
 * 1. Add MapKit or Mapbox dependency
 * 2. Create UIViewRepresentable wrapper for map view
 * 3. Use UIKitView to integrate into Compose
 * 4. Draw route polyline using MKPolyline
 * 5. Add markers using MKPointAnnotation
 *
 * For now, shows placeholder with route/discovery info.
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
    // Placeholder implementation
    Box(
        modifier = modifier
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.Map,
                contentDescription = "Map",
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                "iOS Map (Coming Soon)",
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(8.dp))

            if (route.isNotEmpty()) {
                Text(
                    "${route.size} GPS points",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (discoveries.isNotEmpty()) {
                Text(
                    "${discoveries.size} discoveries",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            currentLocation?.let { location ->
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    "Location: ${String.format("%.4f", location.latitude)}, ${String.format("%.4f", location.longitude)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                "The map will display here on iOS devices",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
            )
        }
    }
}

/**
 * Future MapKit implementation reference:
 *
 * @Composable
 * actual fun JourneyMap(...) {
 *     UIKitView(
 *         factory = {
 *             val mapView = MKMapView()
 *             mapView.mapType = MKMapTypeStandard
 *             mapView.showsUserLocation = showUserLocation
 *
 *             // Add route polyline
 *             if (route.isNotEmpty()) {
 *                 val coordinates = route.map {
 *                     CLLocationCoordinate2DMake(it.latitude, it.longitude)
 *                 }.toTypedArray()
 *
 *                 val polyline = MKPolyline.polylineWithCoordinates(
 *                     coordinates,
 *                     route.size.toULong()
 *                 )
 *                 mapView.addOverlay(polyline)
 *             }
 *
 *             // Add discovery markers
 *             discoveries.forEach { discovery ->
 *                 val annotation = MKPointAnnotation()
 *                 annotation.coordinate = CLLocationCoordinate2DMake(
 *                     discovery.location.latitude,
 *                     discovery.location.longitude
 *                 )
 *                 annotation.title = discovery.getSpeciesName()
 *                 mapView.addAnnotation(annotation)
 *             }
 *
 *             // Zoom to fit route
 *             if (zoomToRoute && route.isNotEmpty()) {
 *                 val bounds = route.toBounds()
 *                 bounds?.let {
 *                     val center = CLLocationCoordinate2DMake(
 *                         it.centerLat,
 *                         it.centerLng
 *                     )
 *                     val span = MKCoordinateSpanMake(
 *                         it.latSpan * 1.2,
 *                         it.lngSpan * 1.2
 *                     )
 *                     val region = MKCoordinateRegionMake(center, span)
 *                     mapView.setRegion(region, animated = true)
 *                 }
 *             }
 *
 *             mapView
 *         },
 *         modifier = modifier
 *     )
 * }
 */
