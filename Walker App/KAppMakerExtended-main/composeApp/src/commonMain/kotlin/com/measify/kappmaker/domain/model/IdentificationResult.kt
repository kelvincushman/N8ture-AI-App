package com.measify.kappmaker.domain.model

import kotlinx.datetime.LocalDateTime
import kotlinx.serialization.Serializable

/**
 * Represents the result of an AI species identification
 */
@Serializable
data class IdentificationResult(
    val id: String,
    val timestamp: String, // ISO 8601 format
    val imageUri: String,
    val primaryMatch: SpeciesMatch,
    val alternativeMatches: List<SpeciesMatch> = emptyList(),
    val location: GeoLocation? = null,
    val category: SpeciesCategory,
    val processingTimeMs: Long = 0
)

/**
 * A single species match with confidence score
 */
@Serializable
data class SpeciesMatch(
    val species: Species,
    val confidenceScore: Float, // 0.0 to 1.0
    val matchDetails: String? = null
) {
    /**
     * Get confidence as percentage (0-100)
     */
    fun getConfidencePercentage(): Int = (confidenceScore * 100).toInt()

    /**
     * Check if confidence is high (>= 80%)
     */
    fun isHighConfidence(): Boolean = confidenceScore >= 0.8f

    /**
     * Check if confidence is medium (50-79%)
     */
    fun isMediumConfidence(): Boolean = confidenceScore in 0.5f..0.79f

    /**
     * Check if confidence is low (< 50%)
     */
    fun isLowConfidence(): Boolean = confidenceScore < 0.5f
}

/**
 * Geolocation data for identification
 */
@Serializable
data class GeoLocation(
    val latitude: Double,
    val longitude: Double,
    val accuracy: Float? = null,
    val locationName: String? = null
)