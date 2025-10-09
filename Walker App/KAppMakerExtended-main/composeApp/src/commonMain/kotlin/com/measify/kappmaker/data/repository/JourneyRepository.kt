package com.measify.kappmaker.data.repository

import com.measify.kappmaker.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * Repository for managing journey tracking
 * Handles journey lifecycle, route recording, and discovery management
 */
@OptIn(ExperimentalUuidApi::class)
class JourneyRepository(
    private val locationManager: LocationManager,
    // TODO: Add JourneyDao when Room entities are created
    // TODO: Add RemoteDataSource for cloud sync
) {
    private val _activeJourney = MutableStateFlow<Journey?>(null)
    val activeJourney: StateFlow<Journey?> = _activeJourney.asStateFlow()

    private val _journeyHistory = MutableStateFlow<List<Journey>>(emptyList())
    val journeyHistory: StateFlow<List<Journey>> = _journeyHistory.asStateFlow()

    private var pauseStartTime: Instant? = null
    private var totalPauseDuration: Long = 0L

    /**
     * Start a new journey
     * Begins GPS tracking and creates journey record
     */
    suspend fun startJourney(
        userId: String,
        title: String = "Nature Walk",
        description: String? = null
    ): Result<Journey> {
        return try {
            // Check if journey already active
            if (_activeJourney.value?.isActive() == true) {
                return Result.failure(Exception("Journey already in progress"))
            }

            // Get current location
            val currentLocation = locationManager.getCurrentLocation()
                ?: return Result.failure(Exception("Unable to get current location"))

            // Create new journey
            val journey = Journey(
                id = Uuid.random().toString(),
                userId = userId,
                title = title,
                description = description,
                startTime = Clock.System.now(),
                endTime = null,
                status = JourneyStatus.ACTIVE,
                route = listOf(currentLocation),
                stats = JourneyStats(),
                discoveries = emptyList(),
                weather = null, // TODO: Fetch weather data
                isPublic = false,
                shareUrl = null
            )

            _activeJourney.value = journey

            // Start location tracking
            locationManager.startTracking { geoPoint ->
                onLocationUpdate(geoPoint)
            }

            // TODO: Save to database
            Result.success(journey)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Pause active journey
     * Stops GPS tracking but keeps journey state
     */
    suspend fun pauseJourney(journeyId: String): Result<Journey> {
        return try {
            val journey = _activeJourney.value
                ?: return Result.failure(Exception("No active journey"))

            if (journey.id != journeyId) {
                return Result.failure(Exception("Journey ID mismatch"))
            }

            if (journey.status != JourneyStatus.ACTIVE) {
                return Result.failure(Exception("Journey is not active"))
            }

            // Stop location tracking
            locationManager.stopTracking()

            // Record pause time
            pauseStartTime = Clock.System.now()

            // Update journey status
            val updatedJourney = journey.copy(status = JourneyStatus.PAUSED)
            _activeJourney.value = updatedJourney

            // TODO: Update in database
            Result.success(updatedJourney)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Resume paused journey
     * Resumes GPS tracking and updates pause duration
     */
    suspend fun resumeJourney(journeyId: String): Result<Journey> {
        return try {
            val journey = _activeJourney.value
                ?: return Result.failure(Exception("No active journey"))

            if (journey.id != journeyId) {
                return Result.failure(Exception("Journey ID mismatch"))
            }

            if (journey.status != JourneyStatus.PAUSED) {
                return Result.failure(Exception("Journey is not paused"))
            }

            // Calculate pause duration
            pauseStartTime?.let { startTime ->
                val pauseDuration = Clock.System.now().toEpochMilliseconds() -
                                   startTime.toEpochMilliseconds()
                totalPauseDuration += pauseDuration
            }
            pauseStartTime = null

            // Resume location tracking
            locationManager.startTracking { geoPoint ->
                onLocationUpdate(geoPoint)
            }

            // Update journey status
            val updatedJourney = journey.copy(status = JourneyStatus.ACTIVE)
            _activeJourney.value = updatedJourney

            // TODO: Update in database
            Result.success(updatedJourney)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * End active journey
     * Stops tracking, calculates final stats, and saves to history
     */
    suspend fun endJourney(journeyId: String): Result<Journey> {
        return try {
            val journey = _activeJourney.value
                ?: return Result.failure(Exception("No active journey"))

            if (journey.id != journeyId) {
                return Result.failure(Exception("Journey ID mismatch"))
            }

            // Stop location tracking
            locationManager.stopTracking()

            // Calculate final stats
            val finalStats = JourneyStats.fromRoute(
                route = journey.route,
                discoveries = emptyList() // TODO: Load actual discoveries
            ).copy(pauseDurationMillis = totalPauseDuration)

            // Complete journey
            val completedJourney = journey.copy(
                status = JourneyStatus.COMPLETED,
                endTime = Clock.System.now(),
                stats = finalStats
            )

            // Clear active journey
            _activeJourney.value = null

            // Add to history
            _journeyHistory.value = _journeyHistory.value + completedJourney

            // Reset pause tracking
            totalPauseDuration = 0L
            pauseStartTime = null

            // TODO: Save to database
            Result.success(completedJourney)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Cancel active journey
     * Discards journey without saving to history
     */
    suspend fun cancelJourney(journeyId: String): Result<Unit> {
        return try {
            val journey = _activeJourney.value
                ?: return Result.failure(Exception("No active journey"))

            if (journey.id != journeyId) {
                return Result.failure(Exception("Journey ID mismatch"))
            }

            // Stop location tracking
            locationManager.stopTracking()

            // Mark as cancelled
            val cancelledJourney = journey.copy(
                status = JourneyStatus.CANCELLED,
                endTime = Clock.System.now()
            )

            // Clear active journey
            _activeJourney.value = null

            // Reset pause tracking
            totalPauseDuration = 0L
            pauseStartTime = null

            // TODO: Optionally save cancelled journeys to database
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Add discovery to active journey
     */
    suspend fun addDiscovery(
        journeyId: String,
        discovery: Discovery
    ): Result<Journey> {
        return try {
            val journey = _activeJourney.value
                ?: return Result.failure(Exception("No active journey"))

            if (journey.id != journeyId) {
                return Result.failure(Exception("Journey ID mismatch"))
            }

            // Add discovery ID to journey
            val updatedJourney = journey.copy(
                discoveries = journey.discoveries + discovery.id
            )

            _activeJourney.value = updatedJourney

            // TODO: Save discovery to database
            // TODO: Update journey in database
            Result.success(updatedJourney)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Get active journey for user
     */
    suspend fun getActiveJourney(userId: String): Journey? {
        return _activeJourney.value?.takeIf { it.userId == userId }
    }

    /**
     * Get journey history for user
     */
    suspend fun getJourneyHistory(
        userId: String,
        limit: Int = 50,
        offset: Int = 0
    ): List<Journey> {
        // TODO: Load from database with pagination
        return _journeyHistory.value
            .filter { it.userId == userId }
            .sortedByDescending { it.startTime }
            .drop(offset)
            .take(limit)
    }

    /**
     * Get journey by ID
     */
    suspend fun getJourneyById(journeyId: String): Journey? {
        // Check active journey first
        _activeJourney.value?.let { journey ->
            if (journey.id == journeyId) return journey
        }

        // TODO: Load from database
        return _journeyHistory.value.find { it.id == journeyId }
    }

    /**
     * Update journey title/description
     */
    suspend fun updateJourneyMetadata(
        journeyId: String,
        title: String? = null,
        description: String? = null,
        tags: List<String>? = null
    ): Result<Journey> {
        return try {
            val journey = getJourneyById(journeyId)
                ?: return Result.failure(Exception("Journey not found"))

            val updatedJourney = journey.copy(
                title = title ?: journey.title,
                description = description ?: journey.description,
                tags = tags ?: journey.tags
            )

            // Update in state
            if (_activeJourney.value?.id == journeyId) {
                _activeJourney.value = updatedJourney
            } else {
                _journeyHistory.value = _journeyHistory.value.map {
                    if (it.id == journeyId) updatedJourney else it
                }
            }

            // TODO: Update in database
            Result.success(updatedJourney)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Delete journey
     */
    suspend fun deleteJourney(journeyId: String): Result<Unit> {
        return try {
            // Remove from history
            _journeyHistory.value = _journeyHistory.value.filter { it.id != journeyId }

            // TODO: Delete from database
            // TODO: Delete associated discoveries
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Share journey (generate public URL)
     */
    suspend fun shareJourney(journeyId: String): Result<String> {
        return try {
            val journey = getJourneyById(journeyId)
                ?: return Result.failure(Exception("Journey not found"))

            // TODO: Upload to cloud storage
            // TODO: Generate share URL
            val shareUrl = "https://n8ture.app/journey/$journeyId"

            val updatedJourney = journey.copy(
                isPublic = true,
                shareUrl = shareUrl
            )

            // Update in state
            if (_activeJourney.value?.id == journeyId) {
                _activeJourney.value = updatedJourney
            } else {
                _journeyHistory.value = _journeyHistory.value.map {
                    if (it.id == journeyId) updatedJourney else it
                }
            }

            // TODO: Update in database
            Result.success(shareUrl)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Export journey as GPX file
     */
    suspend fun exportJourneyAsGPX(journeyId: String): Result<String> {
        return try {
            val journey = getJourneyById(journeyId)
                ?: return Result.failure(Exception("Journey not found"))

            // Generate GPX XML
            val gpx = buildString {
                appendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>")
                appendLine("<gpx version=\"1.1\" creator=\"N8ture App\">")
                appendLine("  <metadata>")
                appendLine("    <name>${journey.title}</name>")
                appendLine("    <time>${journey.startTime}</time>")
                appendLine("  </metadata>")
                appendLine("  <trk>")
                appendLine("    <name>${journey.title}</name>")
                appendLine("    <trkseg>")

                journey.route.forEach { point ->
                    appendLine("      <trkpt lat=\"${point.latitude}\" lon=\"${point.longitude}\">")
                    point.altitude?.let { appendLine("        <ele>$it</ele>") }
                    appendLine("        <time>${point.timestamp}</time>")
                    appendLine("      </trkpt>")
                }

                appendLine("    </trkseg>")
                appendLine("  </trk>")
                appendLine("</gpx>")
            }

            // TODO: Save to file system
            Result.success(gpx)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Get journey statistics summary
     */
    suspend fun getJourneyStatsSummary(userId: String): JourneyStatsSummary {
        val userJourneys = _journeyHistory.value.filter {
            it.userId == userId && it.status == JourneyStatus.COMPLETED
        }

        val totalDistance = userJourneys.sumOf { it.stats.distanceMeters }
        val totalDuration = userJourneys.sumOf { it.stats.durationMillis }
        val totalDiscoveries = userJourneys.sumOf { it.stats.discoveryCount }
        val longestJourney = userJourneys.maxByOrNull { it.stats.distanceMeters }
        val mostDiscoveries = userJourneys.maxByOrNull { it.stats.discoveryCount }

        return JourneyStatsSummary(
            totalJourneys = userJourneys.size,
            totalDistanceMeters = totalDistance,
            totalDurationMillis = totalDuration,
            totalDiscoveries = totalDiscoveries,
            longestJourneyId = longestJourney?.id,
            mostDiscoveriesJourneyId = mostDiscoveries?.id
        )
    }

    /**
     * Handle location updates from LocationManager
     */
    private fun onLocationUpdate(geoPoint: GeoPoint) {
        val journey = _activeJourney.value ?: return

        if (journey.status != JourneyStatus.ACTIVE) return

        // Add point to route
        val updatedRoute = journey.route + geoPoint

        // Recalculate stats
        val updatedStats = JourneyStats.fromRoute(
            route = updatedRoute,
            discoveries = emptyList() // TODO: Load actual discoveries
        ).copy(pauseDurationMillis = totalPauseDuration)

        // Update journey
        _activeJourney.value = journey.copy(
            route = updatedRoute,
            stats = updatedStats
        )

        // TODO: Periodically save to database (e.g., every 10 points)
    }
}

/**
 * Summary statistics for all user journeys
 */
data class JourneyStatsSummary(
    val totalJourneys: Int,
    val totalDistanceMeters: Double,
    val totalDurationMillis: Long,
    val totalDiscoveries: Int,
    val longestJourneyId: String?,
    val mostDiscoveriesJourneyId: String?
) {
    fun getTotalDistanceKm(): Double = totalDistanceMeters / 1000.0
    fun getTotalDistanceMiles(): Double = totalDistanceMeters / 1609.34

    fun getFormattedTotalDistance(useMetric: Boolean = true): String {
        return if (useMetric) {
            String.format("%.1f km", getTotalDistanceKm())
        } else {
            String.format("%.1f mi", getTotalDistanceMiles())
        }
    }
}
