package com.measify.kappmaker.domain.location

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.os.Looper
import androidx.core.content.ContextCompat
import com.google.android.gms.location.*
import com.measify.kappmaker.domain.model.GeoPoint
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.datetime.Instant
import kotlin.coroutines.resume

/**
 * Android implementation of LocationManager using FusedLocationProviderClient
 */
actual class LocationManager(
    private val context: Context,
    private val config: LocationTrackingConfig = LocationTrackingConfig()
) {
    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    private var locationCallback: LocationCallback? = null
    private var isTracking = false

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

        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            config.updateIntervalMs
        ).apply {
            setMinUpdateIntervalMillis(config.fastestIntervalMs)
            setMinUpdateDistanceMeters(config.minDisplacementMeters)
            setWaitForAccurateLocation(true)
        }.build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { location ->
                    callback(location.toGeoPoint())
                }
            }

            override fun onLocationAvailability(availability: LocationAvailability) {
                if (!availability.isLocationAvailable) {
                    // Location unavailable - could notify user
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback!!,
                Looper.getMainLooper()
            )
            isTracking = true
        } catch (e: SecurityException) {
            throw LocationError.PermissionDenied
        }
    }

    /**
     * Stop tracking user location
     */
    actual fun stopTracking() {
        locationCallback?.let {
            fusedLocationClient.removeLocationUpdates(it)
            locationCallback = null
        }
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
            try {
                fusedLocationClient.lastLocation
                    .addOnSuccessListener { location: Location? ->
                        continuation.resume(location?.toGeoPoint())
                    }
                    .addOnFailureListener { exception ->
                        continuation.resume(null)
                    }
            } catch (e: SecurityException) {
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
        val fineLocation = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val coarseLocation = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        return fineLocation || coarseLocation
    }

    /**
     * Request location permissions
     * Note: This requires Activity context for permission request
     * Should be called from UI layer with ActivityResultLauncher
     */
    actual suspend fun requestLocationPermission(): Boolean {
        // This is a placeholder - actual implementation needs Activity context
        // Should be handled by ViewModel/Screen using ActivityResultLauncher
        return hasLocationPermission()
    }

    /**
     * Flow of location updates
     */
    actual fun getLocationUpdates(): Flow<GeoPoint> = callbackFlow {
        if (!hasLocationPermissionSync()) {
            close(LocationError.PermissionDenied)
            return@callbackFlow
        }

        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            config.updateIntervalMs
        ).apply {
            setMinUpdateIntervalMillis(config.fastestIntervalMs)
            setMinUpdateDistanceMeters(config.minDisplacementMeters)
            setWaitForAccurateLocation(true)
        }.build()

        val callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { location ->
                    trySend(location.toGeoPoint())
                }
            }

            override fun onLocationAvailability(availability: LocationAvailability) {
                if (!availability.isLocationAvailable) {
                    // Could send error here if needed
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                callback,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            close(LocationError.PermissionDenied)
            return@callbackFlow
        }

        awaitClose {
            fusedLocationClient.removeLocationUpdates(callback)
        }
    }

    /**
     * Clean up resources
     */
    fun cleanup() {
        stopTracking()
    }
}

/**
 * Extension function to convert Android Location to GeoPoint
 */
private fun Location.toGeoPoint(): GeoPoint {
    return GeoPoint(
        latitude = latitude,
        longitude = longitude,
        altitude = if (hasAltitude()) altitude else null,
        accuracy = if (hasAccuracy()) accuracy else null,
        timestamp = Instant.fromEpochMilliseconds(time),
        speed = if (hasSpeed()) speed else null,
        bearing = if (hasBearing()) bearing else null
    )
}
