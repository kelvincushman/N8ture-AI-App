package com.measify.kappmaker.data.source.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.measify.kappmaker.domain.model.*
import kotlinx.datetime.Instant
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Room entity for Journey data
 */
@Entity(tableName = "journeys")
@TypeConverters(JourneyTypeConverters::class)
data class JourneyEntity(
    @PrimaryKey
    val id: String,
    val userId: String,
    val title: String,
    val description: String?,
    val startTime: Long, // Epoch milliseconds
    val endTime: Long?, // Epoch milliseconds
    val status: String, // JourneyStatus enum name
    val route: String, // JSON array of GeoPoints
    val distanceMeters: Double,
    val durationMillis: Long,
    val elevationGainMeters: Double?,
    val elevationLossMeters: Double?,
    val maxElevationMeters: Double?,
    val minElevationMeters: Double?,
    val avgSpeedMps: Double?,
    val maxSpeedMps: Double?,
    val discoveryCount: Int,
    val photoCount: Int,
    val audioCount: Int,
    val pauseDurationMillis: Long,
    val discoveries: String, // JSON array of discovery IDs
    val weather: String?, // JSON WeatherSnapshot
    val photos: String, // JSON array of photo URLs
    val isPublic: Boolean,
    val shareUrl: String?,
    val tags: String, // JSON array of strings
    val notes: String?
) {
    /**
     * Convert entity to domain model
     */
    fun toDomain(): Journey {
        val json = Json { ignoreUnknownKeys = true }

        return Journey(
            id = id,
            userId = userId,
            title = title,
            description = description,
            startTime = Instant.fromEpochMilliseconds(startTime),
            endTime = endTime?.let { Instant.fromEpochMilliseconds(it) },
            status = JourneyStatus.valueOf(status),
            route = json.decodeFromString<List<GeoPoint>>(route),
            stats = JourneyStats(
                distanceMeters = distanceMeters,
                durationMillis = durationMillis,
                elevationGainMeters = elevationGainMeters,
                elevationLossMeters = elevationLossMeters,
                maxElevationMeters = maxElevationMeters,
                minElevationMeters = minElevationMeters,
                avgSpeedMps = avgSpeedMps,
                maxSpeedMps = maxSpeedMps,
                discoveryCount = discoveryCount,
                photoCount = photoCount,
                audioCount = audioCount,
                pauseDurationMillis = pauseDurationMillis
            ),
            discoveries = json.decodeFromString<List<String>>(discoveries),
            weather = weather?.let { json.decodeFromString<WeatherSnapshot>(it) },
            photos = json.decodeFromString<List<String>>(photos),
            isPublic = isPublic,
            shareUrl = shareUrl,
            tags = json.decodeFromString<List<String>>(tags),
            notes = notes
        )
    }

    companion object {
        /**
         * Convert domain model to entity
         */
        fun fromDomain(journey: Journey): JourneyEntity {
            val json = Json { ignoreUnknownKeys = true }

            return JourneyEntity(
                id = journey.id,
                userId = journey.userId,
                title = journey.title,
                description = journey.description,
                startTime = journey.startTime.toEpochMilliseconds(),
                endTime = journey.endTime?.toEpochMilliseconds(),
                status = journey.status.name,
                route = json.encodeToString(journey.route),
                distanceMeters = journey.stats.distanceMeters,
                durationMillis = journey.stats.durationMillis,
                elevationGainMeters = journey.stats.elevationGainMeters,
                elevationLossMeters = journey.stats.elevationLossMeters,
                maxElevationMeters = journey.stats.maxElevationMeters,
                minElevationMeters = journey.stats.minElevationMeters,
                avgSpeedMps = journey.stats.avgSpeedMps,
                maxSpeedMps = journey.stats.maxSpeedMps,
                discoveryCount = journey.stats.discoveryCount,
                photoCount = journey.stats.photoCount,
                audioCount = journey.stats.audioCount,
                pauseDurationMillis = journey.stats.pauseDurationMillis,
                discoveries = json.encodeToString(journey.discoveries),
                weather = journey.weather?.let { json.encodeToString(it) },
                photos = json.encodeToString(journey.photos),
                isPublic = journey.isPublic,
                shareUrl = journey.shareUrl,
                tags = json.encodeToString(journey.tags),
                notes = journey.notes
            )
        }
    }
}

/**
 * Room entity for Discovery data
 */
@Entity(tableName = "discoveries")
@TypeConverters(DiscoveryTypeConverters::class)
data class DiscoveryEntity(
    @PrimaryKey
    val id: String,
    val journeyId: String?,
    val type: String, // DiscoveryType enum name
    val timestamp: Long, // Epoch milliseconds
    val latitude: Double,
    val longitude: Double,
    val altitude: Double?,
    val accuracy: Float?,
    val speed: Float?,
    val bearing: Float?,
    val mediaUrl: String,
    val thumbnailUrl: String?,
    val identificationResult: String?, // JSON IdentificationResult
    val userNotes: String?,
    val isFavorite: Boolean,
    val isPublic: Boolean,
    val tags: String // JSON array of strings
) {
    /**
     * Convert entity to domain model
     */
    fun toDomain(): Discovery {
        val json = Json { ignoreUnknownKeys = true }

        return Discovery(
            id = id,
            journeyId = journeyId,
            type = DiscoveryType.valueOf(type),
            timestamp = Instant.fromEpochMilliseconds(timestamp),
            location = GeoPoint(
                latitude = latitude,
                longitude = longitude,
                altitude = altitude,
                accuracy = accuracy,
                timestamp = Instant.fromEpochMilliseconds(timestamp),
                speed = speed,
                bearing = bearing
            ),
            mediaUrl = mediaUrl,
            thumbnailUrl = thumbnailUrl,
            identificationResult = identificationResult?.let {
                json.decodeFromString<IdentificationResult>(it)
            },
            userNotes = userNotes,
            isFavorite = isFavorite,
            isPublic = isPublic,
            tags = json.decodeFromString<List<String>>(tags)
        )
    }

    companion object {
        /**
         * Convert domain model to entity
         */
        fun fromDomain(discovery: Discovery): DiscoveryEntity {
            val json = Json { ignoreUnknownKeys = true }

            return DiscoveryEntity(
                id = discovery.id,
                journeyId = discovery.journeyId,
                type = discovery.type.name,
                timestamp = discovery.timestamp.toEpochMilliseconds(),
                latitude = discovery.location.latitude,
                longitude = discovery.location.longitude,
                altitude = discovery.location.altitude,
                accuracy = discovery.location.accuracy,
                speed = discovery.location.speed,
                bearing = discovery.location.bearing,
                mediaUrl = discovery.mediaUrl,
                thumbnailUrl = discovery.thumbnailUrl,
                identificationResult = discovery.identificationResult?.let {
                    json.encodeToString(it)
                },
                userNotes = discovery.userNotes,
                isFavorite = discovery.isFavorite,
                isPublic = discovery.isPublic,
                tags = json.encodeToString(discovery.tags)
            )
        }
    }
}

/**
 * Room entity for Journey Waypoints
 */
@Entity(tableName = "journey_waypoints")
data class JourneyWaypointEntity(
    @PrimaryKey
    val id: String,
    val journeyId: String,
    val latitude: Double,
    val longitude: Double,
    val altitude: Double?,
    val accuracy: Float?,
    val timestamp: Long, // Epoch milliseconds
    val title: String,
    val description: String?,
    val icon: String
) {
    /**
     * Convert entity to domain model
     */
    fun toDomain(): JourneyWaypoint {
        return JourneyWaypoint(
            id = id,
            journeyId = journeyId,
            location = GeoPoint(
                latitude = latitude,
                longitude = longitude,
                altitude = altitude,
                accuracy = accuracy,
                timestamp = Instant.fromEpochMilliseconds(timestamp),
                speed = null,
                bearing = null
            ),
            title = title,
            description = description,
            icon = icon,
            timestamp = Instant.fromEpochMilliseconds(timestamp)
        )
    }

    companion object {
        /**
         * Convert domain model to entity
         */
        fun fromDomain(waypoint: JourneyWaypoint): JourneyWaypointEntity {
            return JourneyWaypointEntity(
                id = waypoint.id,
                journeyId = waypoint.journeyId,
                latitude = waypoint.location.latitude,
                longitude = waypoint.location.longitude,
                altitude = waypoint.location.altitude,
                accuracy = waypoint.location.accuracy,
                timestamp = waypoint.timestamp.toEpochMilliseconds(),
                title = waypoint.title,
                description = waypoint.description,
                icon = waypoint.icon
            )
        }
    }
}

/**
 * Type converters for Journey entity
 */
class JourneyTypeConverters {
    @TypeConverter
    fun fromStringList(value: String): List<String> {
        return Json.decodeFromString(value)
    }

    @TypeConverter
    fun toStringList(list: List<String>): String {
        return Json.encodeToString(list)
    }

    @TypeConverter
    fun fromGeoPointList(value: String): List<GeoPoint> {
        return Json.decodeFromString(value)
    }

    @TypeConverter
    fun toGeoPointList(list: List<GeoPoint>): String {
        return Json.encodeToString(list)
    }

    @TypeConverter
    fun fromWeatherSnapshot(value: String?): WeatherSnapshot? {
        return value?.let { Json.decodeFromString(it) }
    }

    @TypeConverter
    fun toWeatherSnapshot(weather: WeatherSnapshot?): String? {
        return weather?.let { Json.encodeToString(it) }
    }
}

/**
 * Type converters for Discovery entity
 */
class DiscoveryTypeConverters {
    @TypeConverter
    fun fromStringList(value: String): List<String> {
        return Json.decodeFromString(value)
    }

    @TypeConverter
    fun toStringList(list: List<String>): String {
        return Json.encodeToString(list)
    }

    @TypeConverter
    fun fromIdentificationResult(value: String?): IdentificationResult? {
        return value?.let { Json.decodeFromString(it) }
    }

    @TypeConverter
    fun toIdentificationResult(result: IdentificationResult?): String? {
        return result?.let { Json.encodeToString(it) }
    }
}
