package com.measify.kappmaker.domain.location

import com.measify.kappmaker.domain.model.GeoPoint
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.useContents
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.datetime.Instant
import platform.CoreLocation.*
import platform.Foundation.NSDate
import kotlin.coroutines.resume

/**
 * iOS implementation of LocationManager using CLLocationManager
 */
@OptIn(ExperimentalForeignApi::class)
actual class LocationManager(
    private val config: LocationTrackingConfig = LocationTrackingConfig()
) {
    private val locationManager = CLLocationManager()
    private var locationCallback: ((GeoPoint) -> Unit)? = null
    private var isTracking = false

    private val delegate = object : NSObject(), CLLocationManagerDelegateProtocol {
        override fun locationManager(
            manager: CLLocationManager,
            didUpdateLocations: List<*>
        ) {
            (didUpdateLocations.lastOrNull() as? CLLocation)?.let { location ->
                locationCallback?.invoke(location.toGeoPoint())
            }
        }

        override fun locationManager(
            manager: CLLocationManager,
            didFailWithError: platform.Foundation.NSError
        ) {
            // Handle error - could notify user
            when (didFailWithError.code) {
                kCLErrorDenied.toLong() -> {
                    // Permission denied
                }
                kCLErrorLocationUnknown.toLong() -> {
                    // Location unavailable
                }
            }
        }

        override fun locationManagerDidChangeAuthorization(manager: CLLocationManager) {
            // Authorization status changed
            val status = manager.authorizationStatus
            // Could notify app of permission changes
        }
    }

    init {
        locationManager.delegate = delegate
        locationManager.desiredAccuracy = when (config.accuracy) {
            LocationAccuracy.HIGH -> kCLLocationAccuracyBest
            LocationAccuracy.BALANCED -> kCLLocationAccuracyNearestTenMeters
            LocationAccuracy.LOW -> kCLLocationAccuracyHundredMeters
        }
        locationManager.distanceFilter = config.minDisplacementMeters.toDouble()

        // Set activity type for better accuracy
        locationManager.activityType = CLActivityTypeFitness
    }

    /**
     * Start tracking user location
     */
    actual fun startTracking(callback: (GeoPoint) -> Unit) {
        if (!hasLocationPermissionSync()) {
            throw LocationError.PermissionDenied
        }

        if (isTracking) {
            stopTracking()
        }

        locationCallback = callback
        locationManager.startUpdatingLocation()
        isTracking = true
    }

    /**
     * Stop tracking user location
     */
    actual fun stopTracking() {
        locationManager.stopUpdatingLocation()
        locationCallback = null
        isTracking = false
    }

    /**
     * Get current location (one-time request)
     */
    actual suspend fun getCurrentLocation(): GeoPoint? {
        if (!hasLocationPermission()) {
            return null
        }

        return suspendCancellableCoroutine { continuation ->
            locationManager.location?.let { location ->
                continuation.resume(location.toGeoPoint())
            } ?: run {
                // Request one location update
                locationManager.requestLocation()
                // Use delegate callback to get location
                // For simplicity, returning null if no cached location
                continuation.resume(null)
            }
        }
    }

    /**
     * Check if location tracking is currently active
     */
    actual fun isTrackingEnabled(): Boolean = isTracking

    /**
     * Check if location permissions are granted
     */
    actual suspend fun hasLocationPermission(): Boolean {
        return hasLocationPermissionSync()
    }

    private fun hasLocationPermissionSync(): Boolean {
        val status = locationManager.authorizationStatus
        return status == kCLAuthorizationStatusAuthorizedWhenInUse ||
               status == kCLAuthorizationStatusAuthorizedAlways
    }

    /**
     * Request location permissions
     */
    actual suspend fun requestLocationPermission(): Boolean {
        return suspendCancellableCoroutine { continuation ->
            val currentStatus = locationManager.authorizationStatus

            when (currentStatus) {
                kCLAuthorizationStatusAuthorizedWhenInUse,
                kCLAuthorizationStatusAuthorizedAlways -> {
                    continuation.resume(true)
                    return@suspendCancellableCoroutine
                }
                kCLAuthorizationStatusDenied,
                kCLAuthorizationStatusRestricted -> {
                    continuation.resume(false)
                    return@suspendCancellableCoroutine
                }
                kCLAuthorizationStatusNotDetermined -> {
                    // Request permission
                    if (config.allowBackgroundTracking) {
                        locationManager.requestAlwaysAuthorization()
                    } else {
                        locationManager.requestWhenInUseAuthorization()
                    }
                    // Note: Actual result will come via delegate callback
                    // For now, we'll assume pending
                    continuation.resume(false)
                }
            }
        }
    }

    /**
     * Flow of location updates
     */
    actual fun getLocationUpdates(): Flow<GeoPoint> = callbackFlow {
        if (!hasLocationPermissionSync()) {
            close(LocationError.PermissionDenied)
            return@callbackFlow
        }

        val callback: (GeoPoint) -> Unit = { geoPoint ->
            trySend(geoPoint)
        }

        locationCallback = callback
        locationManager.startUpdatingLocation()

        awaitClose {
            locationManager.stopUpdatingLocation()
            locationCallback = null
        }
    }

    /**
     * Clean up resources
     */
    fun cleanup() {
        stopTracking()
        locationManager.delegate = null
    }
}

/**
 * Extension function to convert CLLocation to GeoPoint
 */
@OptIn(ExperimentalForeignApi::class)
private fun CLLocation.toGeoPoint(): GeoPoint {
    return coordinate.useContents {
        GeoPoint(
            latitude = latitude,
            longitude = longitude,
            altitude = if (verticalAccuracy >= 0) altitude else null,
            accuracy = horizontalAccuracy.toFloat(),
            timestamp = Instant.fromEpochMilliseconds((timestamp.timeIntervalSince1970 * 1000).toLong()),
            speed = if (speedAccuracy >= 0) speed.toFloat() else null,
            bearing = if (courseAccuracy >= 0) course.toFloat() else null
        )
    }
}
