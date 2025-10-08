package com.measify.kappmaker.domain.model

import kotlinx.serialization.Serializable

/**
 * User preferences collected during onboarding
 * Used to personalize the app experience
 */
@Serializable
data class UserPreferences(
    val userId: String = "",
    val interests: List<UserInterest> = emptyList(),
    val experienceLevel: ExperienceLevel = ExperienceLevel.BEGINNER,
    val favoriteEnvironments: List<Environment> = emptyList(),
    val hasCompletedOnboarding: Boolean = false,
    val onboardingVersion: Int = 1,
    val permissionsGranted: PermissionStatus = PermissionStatus()
)

/**
 * User interests/motivations for using the app
 */
@Serializable
enum class UserInterest(val displayName: String, val icon: String) {
    HIKING("Hiking & Exploring", "🥾"),
    FORAGING("Foraging", "🍄"),
    BIRDWATCHING("Birdwatching", "🦜"),
    PHOTOGRAPHY("Nature Photography", "📸"),
    PLANTS("Learning About Plants", "🌿"),
    FAMILY_ACTIVITIES("Family Outdoor Activities", "👨‍👩‍👧"),
    CAMPING("Camping & Adventures", "🏕️"),
    WILDLIFE_OBSERVATION("Wildlife Observation", "🦌");

    companion object {
        fun getRecommendedCategories(interests: List<UserInterest>): List<SpeciesCategory> {
            val categories = mutableSetOf<SpeciesCategory>()
            interests.forEach { interest ->
                when (interest) {
                    BIRDWATCHING -> categories.add(SpeciesCategory.BIRD)
                    FORAGING -> {
                        categories.add(SpeciesCategory.PLANT)
                        categories.add(SpeciesCategory.FUNGI)
                    }
                    PLANTS -> categories.add(SpeciesCategory.PLANT)
                    WILDLIFE_OBSERVATION -> {
                        categories.add(SpeciesCategory.MAMMAL)
                        categories.add(SpeciesCategory.BIRD)
                        categories.add(SpeciesCategory.REPTILE)
                    }
                    else -> categories.addAll(SpeciesCategory.values())
                }
            }
            return categories.toList()
        }
    }
}

/**
 * User's experience level with nature identification
 */
@Serializable
enum class ExperienceLevel(
    val displayName: String,
    val description: String,
    val icon: String
) {
    BEGINNER(
        "Beginner",
        "New to nature identification",
        "🌱"
    ),
    INTERMEDIATE(
        "Intermediate",
        "Some experience identifying species",
        "🌿"
    ),
    EXPERT(
        "Expert",
        "I know my local flora and fauna",
        "🌳"
    ),
    PROFESSIONAL(
        "Professional",
        "Park ranger, guide, or researcher",
        "🎓"
    );

    fun getDetailLevel(): DetailLevel {
        return when (this) {
            BEGINNER -> DetailLevel.SIMPLE
            INTERMEDIATE -> DetailLevel.MODERATE
            EXPERT, PROFESSIONAL -> DetailLevel.DETAILED
        }
    }
}

/**
 * Level of detail to show in species information
 */
enum class DetailLevel {
    SIMPLE,      // Basic info, simple language
    MODERATE,    // More details, some technical terms
    DETAILED     // Full scientific information
}

/**
 * Favorite environments for personalized suggestions
 */
@Serializable
enum class Environment(val displayName: String, val icon: String) {
    MOUNTAINS("Mountains & Hills", "🏔️"),
    FORESTS("Forests & Woodlands", "🌲"),
    COASTLINES("Coastlines & Beaches", "🌊"),
    WETLANDS("Rivers & Wetlands", "🏞️"),
    DESERTS("Deserts & Plains", "🏜️"),
    URBAN_PARKS("Parks & Gardens", "🌳");

    companion object {
        fun getCommonSpecies(environments: List<Environment>): Map<Environment, List<String>> {
            // Return common species for each environment
            // This can be expanded with actual species data
            return environments.associateWith { env ->
                when (env) {
                    FORESTS -> listOf("Oak", "Robin", "Deer", "Mushrooms")
                    COASTLINES -> listOf("Seagull", "Crab", "Seaweed", "Shells")
                    WETLANDS -> listOf("Duck", "Heron", "Cattail", "Frog")
                    MOUNTAINS -> listOf("Eagle", "Pine", "Mountain Goat", "Lichen")
                    DESERTS -> listOf("Cactus", "Lizard", "Roadrunner", "Sagebrush")
                    URBAN_PARKS -> listOf("Pigeon", "Squirrel", "Dandelion", "Maple")
                }
            }
        }
    }
}

/**
 * Permission status for various app features
 */
@Serializable
data class PermissionStatus(
    val camera: PermissionState = PermissionState.NOT_REQUESTED,
    val microphone: PermissionState = PermissionState.NOT_REQUESTED,
    val location: PermissionState = PermissionState.NOT_REQUESTED,
    val locationAlways: PermissionState = PermissionState.NOT_REQUESTED,
    val storage: PermissionState = PermissionState.NOT_REQUESTED,
    val notifications: PermissionState = PermissionState.NOT_REQUESTED
) {
    fun hasRequiredPermissions(): Boolean {
        return camera == PermissionState.GRANTED
    }

    fun hasAllPermissions(): Boolean {
        return camera == PermissionState.GRANTED &&
                microphone == PermissionState.GRANTED &&
                location == PermissionState.GRANTED &&
                storage == PermissionState.GRANTED
    }

    fun getMissingCriticalPermissions(): List<String> {
        val missing = mutableListOf<String>()
        if (camera != PermissionState.GRANTED) missing.add("Camera")
        return missing
    }

    fun getMissingOptionalPermissions(): List<String> {
        val missing = mutableListOf<String>()
        if (microphone != PermissionState.GRANTED) missing.add("Microphone")
        if (location != PermissionState.GRANTED) missing.add("Location")
        if (storage != PermissionState.GRANTED) missing.add("Storage")
        return missing
    }
}

/**
 * State of a single permission
 */
@Serializable
enum class PermissionState {
    NOT_REQUESTED,
    REQUESTED,
    GRANTED,
    DENIED,
    DENIED_PERMANENTLY
}

/**
 * Onboarding progress tracking
 */
@Serializable
data class OnboardingProgress(
    val currentStep: Int = 0,
    val totalSteps: Int = 7,
    val completedSteps: Set<Int> = emptySet()
) {
    fun isComplete(): Boolean = completedSteps.size >= totalSteps
    fun percentComplete(): Float = (completedSteps.size.toFloat() / totalSteps) * 100f
}
