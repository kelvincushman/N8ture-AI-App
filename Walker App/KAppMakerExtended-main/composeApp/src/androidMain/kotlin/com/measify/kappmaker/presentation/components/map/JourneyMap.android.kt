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

/**
 * Android implementation of JourneyMap using Mapbox Maps SDK
 *
 * Setup Requirements:
 * 1. Add dependency to composeApp/build.gradle.kts:
 *    implementation("com.mapbox.maps:android:11.0.0")
 *
 * 2. Add Mapbox token to local.properties:
 *    MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4In0.xxxxx
 *
 * 3. Configure AndroidManifest.xml:
 *    <meta-data
 *        android:name="MAPBOX_ACCESS_TOKEN"
 *        android:value="${MAPBOX_ACCESS_TOKEN}" />
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
    val context = LocalContext.current
    var mapView: MapView? by remember { mutableStateOf(null) }
    var isStyleLoaded by remember { mutableStateOf(false) }

    AndroidView(
        factory = { ctx ->
            MapView(ctx).also { view ->
                mapView = view

                // Load Mapbox outdoors style (optimized for nature/hiking)
                view.getMapboxMap().loadStyleUri(
                    Style.OUTDOORS,
                    object : Style.OnStyleLoaded {
                        override fun onStyleLoaded(style: Style) {
                            isStyleLoaded = true
                            setupMap(
                                view,
                                route,
                                discoveries,
                                currentLocation,
                                zoomToRoute,
                                onMarkerClick
                            )
                        }
                    }
                )
            }
        },
        update = { view ->
            // Update map when data changes
            if (isStyleLoaded) {
                setupMap(
                    view,
                    route,
                    discoveries,
                    currentLocation,
                    zoomToRoute,
                    onMarkerClick
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

/**
 * Setup map with route, markers, and camera position
 */
private fun setupMap(
    mapView: MapView,
    route: List<GeoPoint>,
    discoveries: List<Discovery>,
    currentLocation: GeoPoint?,
    zoomToRoute: Boolean,
    onMarkerClick: (Discovery) -> Unit
) {
    val mapboxMap = mapView.getMapboxMap()
    val annotationApi = mapView.annotations

    // Clear existing annotations
    annotationApi.cleanup()

    // 1. Draw route polyline
    if (route.isNotEmpty()) {
        val polylineManager = annotationApi.createPolylineAnnotationManager()

        val points = route.map { Point.fromLngLat(it.longitude, it.latitude) }
        val polylineOptions = PolylineAnnotationOptions()
            .withPoints(points)
            .withLineColor("#2196F3") // Material Blue
            .withLineWidth(5.0)
            .withLineOpacity(0.8)

        polylineManager.create(polylineOptions)

        // Zoom camera to fit route
        if (zoomToRoute) {
            val bounds = route.toBounds()
            bounds?.let {
                mapboxMap.setCamera(
                    CameraOptions.Builder()
                        .center(Point.fromLngLat(it.centerLng, it.centerLat))
                        .zoom(it.calculateZoomLevel())
                        .padding(com.mapbox.maps.EdgeInsets(50.0, 50.0, 50.0, 50.0))
                        .build()
                )
            }
        }
    }

    // 2. Add discovery markers
    if (discoveries.isNotEmpty()) {
        val pointAnnotationManager = annotationApi.createPointAnnotationManager()

        discoveries.forEachIndexed { index, discovery ->
            val pointOptions = PointAnnotationOptions()
                .withPoint(Point.fromLngLat(
                    discovery.location.longitude,
                    discovery.location.latitude
                ))
                // Use Mapbox's built-in marker icon
                .withIconImage("marker-15")
                .withIconSize(1.5)
                // Add species name as text
                .withTextField(discovery.getSpeciesName() ?: "Unknown")
                .withTextSize(12.0)
                .withTextColor("#000000")
                .withTextHaloColor("#FFFFFF")
                .withTextHaloWidth(1.5)
                .withTextOffset(listOf(0.0, 1.5))

            pointAnnotationManager.create(pointOptions)
        }

        // Add click listener for markers
        pointAnnotationManager.addClickListener { clickedAnnotation ->
            // Find discovery at clicked location
            val discovery = discoveries.find {
                it.location.longitude == clickedAnnotation.point.longitude() &&
                it.location.latitude == clickedAnnotation.point.latitude()
            }

            discovery?.let {
                onMarkerClick(it)
            }

            true // Consume the event
        }
    }

    // 3. Add current location marker (blue pulsing dot)
    currentLocation?.let { location ->
        val circleManager = annotationApi.createCircleAnnotationManager()

        // Outer pulse circle
        val outerCircleOptions = CircleAnnotationOptions()
            .withPoint(Point.fromLngLat(location.longitude, location.latitude))
            .withCircleRadius(16.0)
            .withCircleColor("#2196F3")
            .withCircleOpacity(0.2)

        circleManager.create(outerCircleOptions)

        // Inner solid circle
        val innerCircleOptions = CircleAnnotationOptions()
            .withPoint(Point.fromLngLat(location.longitude, location.latitude))
            .withCircleRadius(8.0)
            .withCircleColor("#2196F3")
            .withCircleStrokeWidth(2.0)
            .withCircleStrokeColor("#FFFFFF")

        circleManager.create(innerCircleOptions)
    }
}
