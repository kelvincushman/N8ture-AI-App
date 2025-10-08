package com.measify.kappmaker.domain.model

import kotlinx.serialization.Serializable

/**
 * Represents a wildlife, plant, or fungi species
 */
@Serializable
data class Species(
    val id: String,
    val commonName: String,
    val scientificName: String,
    val family: String,
    val category: SpeciesCategory,
    val description: String,
    val detailedDescription: String? = null,
    val habitat: String,
    val edibility: EdibilityStatus,
    val edibilityDetails: String? = null,
    val herbalBenefits: String? = null,
    val safetyWarning: String? = null,
    val conservationStatus: String? = null,
    val seasonalAvailability: String? = null,
    val preparationMethods: String? = null,
    val imageUrls: List<String> = emptyList(),
    val similarSpeciesIds: List<String> = emptyList(),
    val isPremiumContent: Boolean = false
)

@Serializable
enum class SpeciesCategory {
    PLANT,
    MAMMAL,
    BIRD,
    REPTILE,
    AMPHIBIAN,
    INSECT,
    FUNGI,
    UNKNOWN
}

@Serializable
enum class EdibilityStatus {
    EDIBLE,          // 🟢 Green - Safe to eat
    CONDITIONALLY_EDIBLE, // 🟡 Yellow - Edible with preparation
    INEDIBLE,        // ⚪ Gray - Not edible but not dangerous
    POISONOUS,       // 🔴 Red - Dangerous/toxic
    NOT_APPLICABLE,  // For animals
    UNKNOWN          // Insufficient data
}

/**
 * Extension to get safety indicator color
 */
fun EdibilityStatus.getSafetyColor(): SafetyColor = when (this) {
    EdibilityStatus.EDIBLE -> SafetyColor.GREEN
    EdibilityStatus.CONDITIONALLY_EDIBLE -> SafetyColor.YELLOW
    EdibilityStatus.INEDIBLE -> SafetyColor.GRAY
    EdibilityStatus.POISONOUS -> SafetyColor.RED
    EdibilityStatus.NOT_APPLICABLE -> SafetyColor.GRAY
    EdibilityStatus.UNKNOWN -> SafetyColor.GRAY
}

enum class SafetyColor {
    GREEN, YELLOW, RED, GRAY
}