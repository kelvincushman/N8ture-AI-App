package com.measify.kappmaker.domain.location

import com.measify.kappmaker.domain.model.GeoPoint
import kotlinx.coroutines.flow.Flow

/**
 * Platform-agnostic interface for GPS location tracking
 * Implementations:
 * - Android: FusedLocationProviderClient
 * - iOS: CLLocationManager
 */
expect class LocationManager {
    /**
     * Start tracking user location
     * @param callback Called with each location update
     */
    fun startTracking(callback: (GeoPoint) -> Unit)

    /**
     * Stop tracking user location
     */
    fun stopTracking()

    /**
     * Get current location (one-time request)
     * @return Current GeoPoint or null if unavailable
     */
    suspend fun getCurrentLocation(): GeoPoint?

    /**
     * Check if location tracking is currently active
     */
    fun isTrackingEnabled(): Boolean

    /**
     * Check if location permissions are granted
     */
    suspend fun hasLocationPermission(): Boolean

    /**
     * Request location permissions
     * @return true if granted, false if denied
     */
    suspend fun requestLocationPermission(): Boolean

    /**
     * Flow of location updates
     * Use this for reactive location tracking
     */
    fun getLocationUpdates(): Flow<GeoPoint>
}

/**
 * Location tracking configuration
 */
data class LocationTrackingConfig(
    /**
     * Minimum time interval between location updates (milliseconds)
     * Default: 5000ms (5 seconds)
     */
    val updateIntervalMs: Long = 5000L,

    /**
     * Fastest allowed update interval (milliseconds)
     * Default: 2000ms (2 seconds)
     */
    val fastestIntervalMs: Long = 2000L,

    /**
     * Minimum displacement between updates (meters)
     * Default: 10 meters
     */
    val minDisplacementMeters: Float = 10f,

    /**
     * Desired location accuracy
     * Default: HIGH
     */
    val accuracy: LocationAccuracy = LocationAccuracy.HIGH,

    /**
     * Allow background location tracking
     * Requires additional permissions on both platforms
     */
    val allowBackgroundTracking: Boolean = false
)

/**
 * Location accuracy levels
 */
enum class LocationAccuracy {
    /**
     * High accuracy using GPS
     * Battery impact: High
     * Accuracy: < 10 meters
     */
    HIGH,

    /**
     * Balanced accuracy using GPS + network
     * Battery impact: Medium
     * Accuracy: ~50 meters
     */
    BALANCED,

    /**
     * Low accuracy using network only
     * Battery impact: Low
     * Accuracy: ~500 meters
     */
    LOW
}

/**
 * Location permission status
 */
enum class LocationPermissionStatus {
    /** Permission granted for foreground location */
    GRANTED,

    /** Permission granted for background location (always) */
    GRANTED_BACKGROUND,

    /** Permission denied by user */
    DENIED,

    /** Permission permanently denied (user selected "don't ask again") */
    DENIED_PERMANENTLY,

    /** Permission not yet requested */
    NOT_REQUESTED
}

/**
 * Location error types
 */
sealed class LocationError : Exception() {
    /** Location services are disabled on device */
    object LocationServicesDisabled : LocationError()

    /** Location permission not granted */
    object PermissionDenied : LocationError()

    /** Unable to determine location */
    object LocationUnavailable : LocationError()

    /** Timeout waiting for location */
    object Timeout : LocationError()

    /** Unknown error */
    data class Unknown(override val message: String?) : LocationError()
}
