package com.measify.kappmaker.data.source.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.measify.kappmaker.domain.model.GeoLocation
import com.measify.kappmaker.domain.model.IdentificationResult
import com.measify.kappmaker.domain.model.SpeciesCategory
import com.measify.kappmaker.domain.model.SpeciesMatch

/**
 * Room entity for storing identification history
 */
@Entity(tableName = "identification_history")
data class IdentificationHistoryEntity(
    @PrimaryKey
    val id: String,
    val timestamp: String, // ISO 8601 format
    val imageUri: String,
    val primaryMatchSpeciesId: String,
    val primaryMatchConfidence: Float,
    val alternativeMatchesJson: String = "", // JSON array of alternative matches
    val category: String, // SpeciesCategory as String
    val latitude: Double? = null,
    val longitude: Double? = null,
    val locationAccuracy: Float? = null,
    val locationName: String? = null,
    val processingTimeMs: Long = 0,
    val isFavorite: Boolean = false,
    val notes: String? = null
)

/**
 * Simplified alternative match for JSON storage
 */
data class AlternativeMatchJson(
    val speciesId: String,
    val confidence: Float
)

/**
 * Convert IdentificationHistoryEntity to Domain Model
 * Note: Requires separate species lookup
 */
fun IdentificationHistoryEntity.toDomain(
    primarySpecies: com.measify.kappmaker.domain.model.Species,
    alternativeSpecies: List<Pair<com.measify.kappmaker.domain.model.Species, Float>> = emptyList()
): IdentificationResult {
    val location = if (latitude != null && longitude != null) {
        GeoLocation(
            latitude = latitude,
            longitude = longitude,
            accuracy = locationAccuracy,
            locationName = locationName
        )
    } else null

    val primaryMatch = SpeciesMatch(
        species = primarySpecies,
        confidenceScore = primaryMatchConfidence
    )

    val alternatives = alternativeSpecies.map { (species, confidence) ->
        SpeciesMatch(
            species = species,
            confidenceScore = confidence
        )
    }

    return IdentificationResult(
        id = id,
        timestamp = timestamp,
        imageUri = imageUri,
        primaryMatch = primaryMatch,
        alternativeMatches = alternatives,
        location = location,
        category = SpeciesCategory.valueOf(category),
        processingTimeMs = processingTimeMs
    )
}

/**
 * Convert IdentificationResult to Entity
 */
fun IdentificationResult.toEntity(
    isFavorite: Boolean = false,
    notes: String? = null
): IdentificationHistoryEntity {
    return IdentificationHistoryEntity(
        id = id,
        timestamp = timestamp,
        imageUri = imageUri,
        primaryMatchSpeciesId = primaryMatch.species.id,
        primaryMatchConfidence = primaryMatch.confidenceScore,
        alternativeMatchesJson = "", // Simplified for now
        category = category.name,
        latitude = location?.latitude,
        longitude = location?.longitude,
        locationAccuracy = location?.accuracy,
        locationName = location?.locationName,
        processingTimeMs = processingTimeMs,
        isFavorite = isFavorite,
        notes = notes
    )
}