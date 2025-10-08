package com.measify.kappmaker.data.source.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.measify.kappmaker.domain.model.EdibilityStatus
import com.measify.kappmaker.domain.model.Species
import com.measify.kappmaker.domain.model.SpeciesCategory

/**
 * Room entity for caching species information offline
 */
@Entity(tableName = "species")
data class SpeciesEntity(
    @PrimaryKey
    val id: String,
    val commonName: String,
    val scientificName: String,
    val family: String,
    val category: String, // SpeciesCategory as String
    val description: String,
    val detailedDescription: String? = null,
    val habitat: String,
    val edibility: String, // EdibilityStatus as String
    val edibilityDetails: String? = null,
    val herbalBenefits: String? = null,
    val safetyWarning: String? = null,
    val conservationStatus: String? = null,
    val seasonalAvailability: String? = null,
    val preparationMethods: String? = null,
    val imageUrls: String = "", // Comma-separated URLs
    val similarSpeciesIds: String = "", // Comma-separated IDs
    val isPremiumContent: Boolean = false,
    val cachedAt: Long = System.currentTimeMillis()
)

/**
 * Convert SpeciesEntity to Domain Model
 */
fun SpeciesEntity.toDomain(): Species = Species(
    id = id,
    commonName = commonName,
    scientificName = scientificName,
    family = family,
    category = SpeciesCategory.valueOf(category),
    description = description,
    detailedDescription = detailedDescription,
    habitat = habitat,
    edibility = EdibilityStatus.valueOf(edibility),
    edibilityDetails = edibilityDetails,
    herbalBenefits = herbalBenefits,
    safetyWarning = safetyWarning,
    conservationStatus = conservationStatus,
    seasonalAvailability = seasonalAvailability,
    preparationMethods = preparationMethods,
    imageUrls = imageUrls.split(",").filter { it.isNotBlank() },
    similarSpeciesIds = similarSpeciesIds.split(",").filter { it.isNotBlank() },
    isPremiumContent = isPremiumContent
)

/**
 * Convert Domain Model to SpeciesEntity
 */
fun Species.toEntity(): SpeciesEntity = SpeciesEntity(
    id = id,
    commonName = commonName,
    scientificName = scientificName,
    family = family,
    category = category.name,
    description = description,
    detailedDescription = detailedDescription,
    habitat = habitat,
    edibility = edibility.name,
    edibilityDetails = edibilityDetails,
    herbalBenefits = herbalBenefits,
    safetyWarning = safetyWarning,
    conservationStatus = conservationStatus,
    seasonalAvailability = seasonalAvailability,
    preparationMethods = preparationMethods,
    imageUrls = imageUrls.joinToString(","),
    similarSpeciesIds = similarSpeciesIds.joinToString(","),
    isPremiumContent = isPremiumContent
)