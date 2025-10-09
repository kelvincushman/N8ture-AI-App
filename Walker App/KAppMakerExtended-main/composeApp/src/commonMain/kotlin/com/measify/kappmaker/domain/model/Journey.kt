package com.measify.kappmaker.domain.model

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds

/**
 * Represents a tracked outdoor journey/walk
 * Core model for journey tracking feature
 */
@Serializable
data class Journey(
    val id: String,
    val userId: String,
    val title: String = "Nature Walk",
    val description: String? = null,
    val startTime: Instant,
    val endTime: Instant? = null,
    val status: JourneyStatus,
    val route: List<GeoPoint> = emptyList(),
    val stats: JourneyStats = JourneyStats(),
    val discoveries: List<String> = emptyList(), // Discovery IDs
    val weather: WeatherSnapshot? = null,
    val photos: List<String> = emptyList(), // Photo URLs
    val isPublic: Boolean = false,
    val shareUrl: String? = null,
    val tags: List<String> = emptyList(),
    val notes: String? = null
) {
    /**
     * Check if journey is currently active
     */
    fun isActive(): Boolean = status == JourneyStatus.ACTIVE

    /**
     * Check if journey is completed
     */
    fun isCompleted(): Boolean = status == JourneyStatus.COMPLETED

    /**
     * Get journey duration
     */
    fun getDuration(): Duration {
        val end = endTime ?: Instant.DISTANT_FUTURE
        return (end.toEpochMilliseconds() - startTime.toEpochMilliseconds()).milliseconds
    }

    /**
     * Get formatted duration string
     */
    fun getFormattedDuration(): String {
        val duration = getDuration()
        val hours = duration.inWholeHours
        val minutes = (duration.inWholeMinutes % 60)

        return when {
            hours > 0 -> "${hours}h ${minutes}m"
            else -> "${minutes}m"
        }
    }

    /**
     * Get discovery count
     */
    fun getDiscoveryCount(): Int = discoveries.size

    /**
     * Get photo count
     */
    fun getPhotoCount(): Int = photos.size
}

/**
 * Journey status enum
 */
@Serializable
enum class JourneyStatus {
    ACTIVE,      // Currently tracking
    PAUSED,      // Temporarily paused
    COMPLETED,   // Finished
    CANCELLED    // Abandoned/cancelled
}

/**
 * Geographic point with coordinates and metadata
 */
@Serializable
data class GeoPoint(
    val latitude: Double,
    val longitude: Double,
    val altitude: Double? = null,
    val accuracy: Float? = null,
    val timestamp: Instant,
    val speed: Float? = null, // m/s
    val bearing: Float? = null // degrees
) {
    /**
     * Calculate distance to another point in meters
     * Using Haversine formula
     */
    fun distanceTo(other: GeoPoint): Double {
        val earthRadius = 6371000.0 // meters

        val lat1Rad = Math.toRadians(latitude)
        val lat2Rad = Math.toRadians(other.latitude)
        val deltaLat = Math.toRadians(other.latitude - latitude)
        val deltaLon = Math.toRadians(other.longitude - longitude)

        val a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

        val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return earthRadius * c
    }

    /**
     * Check if point is within bounds
     */
    fun isWithinBounds(bounds: GeoBounds): Boolean {
        return latitude >= bounds.south &&
                latitude <= bounds.north &&
                longitude >= bounds.west &&
                longitude <= bounds.east
    }
}

/**
 * Geographic bounds for map display
 */
@Serializable
data class GeoBounds(
    val north: Double,
    val south: Double,
    val east: Double,
    val west: Double
) {
    /**
     * Get center point
     */
    fun getCenter(): GeoPoint {
        return GeoPoint(
            latitude = (north + south) / 2,
            longitude = (east + west) / 2,
            timestamp = Instant.DISTANT_PAST
        )
    }

    /**
     * Expand bounds to include a point
     */
    fun expand(point: GeoPoint): GeoBounds {
        return GeoBounds(
            north = maxOf(north, point.latitude),
            south = minOf(south, point.latitude),
            east = maxOf(east, point.longitude),
            west = minOf(west, point.longitude)
        )
    }

    companion object {
        /**
         * Create bounds from a list of points
         */
        fun fromPoints(points: List<GeoPoint>): GeoBounds? {
            if (points.isEmpty()) return null

            var north = points[0].latitude
            var south = points[0].latitude
            var east = points[0].longitude
            var west = points[0].longitude

            points.forEach { point ->
                north = maxOf(north, point.latitude)
                south = minOf(south, point.latitude)
                east = maxOf(east, point.longitude)
                west = minOf(west, point.longitude)
            }

            return GeoBounds(north, south, east, west)
        }
    }
}

/**
 * Journey statistics
 */
@Serializable
data class JourneyStats(
    val distanceMeters: Double = 0.0,
    val durationMillis: Long = 0L,
    val elevationGainMeters: Double? = null,
    val elevationLossMeters: Double? = null,
    val maxElevationMeters: Double? = null,
    val minElevationMeters: Double? = null,
    val avgSpeedMps: Double? = null,
    val maxSpeedMps: Double? = null,
    val discoveryCount: Int = 0,
    val photoCount: Int = 0,
    val audioCount: Int = 0,
    val pauseDurationMillis: Long = 0L
) {
    /**
     * Get distance in kilometers
     */
    fun getDistanceKm(): Double = distanceMeters / 1000.0

    /**
     * Get distance in miles
     */
    fun getDistanceMiles(): Double = distanceMeters / 1609.34

    /**
     * Get formatted distance
     */
    fun getFormattedDistance(useMetric: Boolean = true): String {
        return if (useMetric) {
            String.format("%.2f km", getDistanceKm())
        } else {
            String.format("%.2f mi", getDistanceMiles())
        }
    }

    /**
     * Get duration
     */
    fun getDuration(): Duration = durationMillis.milliseconds

    /**
     * Get active duration (excluding pauses)
     */
    fun getActiveDuration(): Duration = (durationMillis - pauseDurationMillis).milliseconds

    /**
     * Get formatted duration
     */
    fun getFormattedDuration(): String {
        val duration = getDuration()
        val hours = duration.inWholeHours
        val minutes = (duration.inWholeMinutes % 60)
        val seconds = (duration.inWholeSeconds % 60)

        return when {
            hours > 0 -> String.format("%dh %02dm", hours, minutes)
            minutes > 0 -> String.format("%dm %02ds", minutes, seconds)
            else -> "${seconds}s"
        }
    }

    /**
     * Get average speed in km/h
     */
    fun getAvgSpeedKmh(): Double? {
        return avgSpeedMps?.times(3.6)
    }

    /**
     * Get formatted average speed
     */
    fun getFormattedAvgSpeed(useMetric: Boolean = true): String? {
        val speed = avgSpeedMps ?: return null
        return if (useMetric) {
            String.format("%.1f km/h", speed * 3.6)
        } else {
            String.format("%.1f mph", speed * 2.23694)
        }
    }

    /**
     * Calculate stats from route
     */
    companion object {
        fun fromRoute(route: List<GeoPoint>, discoveries: List<Discovery> = emptyList()): JourneyStats {
            if (route.isEmpty()) return JourneyStats()

            var totalDistance = 0.0
            var elevationGain = 0.0
            var elevationLoss = 0.0
            var maxElevation = route[0].altitude ?: 0.0
            var minElevation = route[0].altitude ?: 0.0
            var maxSpeed = 0.0f

            for (i in 1 until route.size) {
                val prev = route[i - 1]
                val current = route[i]

                // Distance
                totalDistance += prev.distanceTo(current)

                // Elevation
                val prevAlt = prev.altitude
                val currAlt = current.altitude
                if (prevAlt != null && currAlt != null) {
                    val elevDiff = currAlt - prevAlt
                    if (elevDiff > 0) {
                        elevationGain += elevDiff
                    } else {
                        elevationLoss += -elevDiff
                    }
                    maxElevation = maxOf(maxElevation, currAlt)
                    minElevation = minOf(minElevation, currAlt)
                }

                // Speed
                current.speed?.let { speed ->
                    maxSpeed = maxOf(maxSpeed, speed)
                }
            }

            // Calculate average speed
            val firstPoint = route.first()
            val lastPoint = route.last()
            val durationSec = (lastPoint.timestamp.toEpochMilliseconds() -
                              firstPoint.timestamp.toEpochMilliseconds()) / 1000.0
            val avgSpeed = if (durationSec > 0) totalDistance / durationSec else 0.0

            return JourneyStats(
                distanceMeters = totalDistance,
                durationMillis = (durationSec * 1000).toLong(),
                elevationGainMeters = if (elevationGain > 0) elevationGain else null,
                elevationLossMeters = if (elevationLoss > 0) elevationLoss else null,
                maxElevationMeters = if (route.any { it.altitude != null }) maxElevation else null,
                minElevationMeters = if (route.any { it.altitude != null }) minElevation else null,
                avgSpeedMps = avgSpeed,
                maxSpeedMps = if (maxSpeed > 0) maxSpeed.toDouble() else null,
                discoveryCount = discoveries.size,
                photoCount = discoveries.count { it.type == DiscoveryType.PHOTO_PLANT ||
                                               it.type == DiscoveryType.PHOTO_WILDLIFE ||
                                               it.type == DiscoveryType.PHOTO_FUNGI },
                audioCount = discoveries.count { it.type == DiscoveryType.AUDIO_BIRD ||
                                                it.type == DiscoveryType.AUDIO_MAMMAL ||
                                                it.type == DiscoveryType.AUDIO_INSECT }
            )
        }
    }
}

/**
 * Discovery point during a journey
 */
@Serializable
data class Discovery(
    val id: String,
    val journeyId: String?,
    val type: DiscoveryType,
    val timestamp: Instant,
    val location: GeoPoint,
    val mediaUrl: String, // Photo or audio file path/URL
    val thumbnailUrl: String? = null,
    val identificationResult: IdentificationResult? = null,
    val userNotes: String? = null,
    val isFavorite: Boolean = false,
    val isPublic: Boolean = false,
    val tags: List<String> = emptyList()
) {
    /**
     * Get species name if identified
     */
    fun getSpeciesName(): String? {
        return identificationResult?.primaryMatch?.species?.commonName
    }

    /**
     * Check if identification is confident
     */
    fun isConfident(): Boolean {
        val confidence = identificationResult?.primaryMatch?.confidence ?: 0f
        return confidence >= 0.7f
    }

    /**
     * Get discovery type icon
     */
    fun getTypeIcon(): String {
        return when (type) {
            DiscoveryType.PHOTO_PLANT -> "🌿"
            DiscoveryType.PHOTO_WILDLIFE -> "🦌"
            DiscoveryType.PHOTO_FUNGI -> "🍄"
            DiscoveryType.AUDIO_BIRD -> "🦜"
            DiscoveryType.AUDIO_MAMMAL -> "🐾"
            DiscoveryType.AUDIO_INSECT -> "🐛"
            DiscoveryType.MANUAL_OBSERVATION -> "📝"
        }
    }
}

/**
 * Types of discoveries
 */
@Serializable
enum class DiscoveryType {
    PHOTO_PLANT,
    PHOTO_WILDLIFE,
    PHOTO_FUNGI,
    AUDIO_BIRD,
    AUDIO_MAMMAL,
    AUDIO_INSECT,
    MANUAL_OBSERVATION
}

/**
 * Weather snapshot at journey time
 */
@Serializable
data class WeatherSnapshot(
    val temperature: Double, // Celsius
    val condition: WeatherCondition,
    val humidity: Int? = null, // Percentage
    val windSpeed: Double? = null, // m/s
    val pressure: Double? = null, // hPa
    val timestamp: Instant
) {
    /**
     * Get temperature in Fahrenheit
     */
    fun getTemperatureFahrenheit(): Double = (temperature * 9/5) + 32

    /**
     * Get formatted temperature
     */
    fun getFormattedTemperature(useCelsius: Boolean = true): String {
        return if (useCelsius) {
            "${temperature.toInt()}°C"
        } else {
            "${getTemperatureFahrenheit().toInt()}°F"
        }
    }
}

/**
 * Weather conditions
 */
@Serializable
enum class WeatherCondition(val icon: String, val description: String) {
    CLEAR("☀️", "Clear"),
    PARTLY_CLOUDY("⛅", "Partly Cloudy"),
    CLOUDY("☁️", "Cloudy"),
    RAIN("🌧️", "Rain"),
    HEAVY_RAIN("⛈️", "Heavy Rain"),
    SNOW("❄️", "Snow"),
    FOG("🌫️", "Fog"),
    WIND("💨", "Windy"),
    UNKNOWN("❓", "Unknown")
}

/**
 * Journey waypoint/marker
 */
@Serializable
data class JourneyWaypoint(
    val id: String,
    val journeyId: String,
    val location: GeoPoint,
    val title: String,
    val description: String? = null,
    val icon: String = "📍",
    val timestamp: Instant
)
