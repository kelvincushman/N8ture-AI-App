package com.measify.kappmaker.data.repository

import com.measify.kappmaker.domain.model.*
import com.russhwolf.settings.Settings
import com.russhwolf.settings.get
import com.russhwolf.settings.set
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Repository for managing user preferences
 * Stores onboarding data and user customization settings
 */
class UserPreferencesRepository(
    private val settings: Settings
) {
    private val json = Json {
        prettyPrint = true
        ignoreUnknownKeys = true
    }

    companion object {
        private const val KEY_USER_PREFERENCES = "user_preferences"
        private const val KEY_ONBOARDING_COMPLETED = "onboarding_completed"
        private const val KEY_ONBOARDING_VERSION = "onboarding_version"
        private const val KEY_PERMISSIONS_STATUS = "permissions_status"
    }

    /**
     * Save user preferences
     */
    fun savePreferences(preferences: UserPreferences) {
        val preferencesJson = json.encodeToString(preferences)
        settings[KEY_USER_PREFERENCES] = preferencesJson
        settings[KEY_ONBOARDING_COMPLETED] = preferences.hasCompletedOnboarding
        settings[KEY_ONBOARDING_VERSION] = preferences.onboardingVersion
    }

    /**
     * Get user preferences
     */
    fun getPreferences(): UserPreferences {
        val preferencesJson: String? = settings[KEY_USER_PREFERENCES]
        return if (preferencesJson != null) {
            try {
                json.decodeFromString<UserPreferences>(preferencesJson)
            } catch (e: Exception) {
                UserPreferences() // Return default if parsing fails
            }
        } else {
            UserPreferences()
        }
    }

    /**
     * Check if onboarding has been completed
     */
    fun hasCompletedOnboarding(): Boolean {
        return settings.getBoolean(KEY_ONBOARDING_COMPLETED, false)
    }

    /**
     * Get onboarding version completed by user
     */
    fun getOnboardingVersion(): Int {
        return settings.getInt(KEY_ONBOARDING_VERSION, 0)
    }

    /**
     * Check if new onboarding is available
     */
    fun shouldShowOnboarding(currentVersion: Int = 1): Boolean {
        return !hasCompletedOnboarding() || getOnboardingVersion() < currentVersion
    }

    /**
     * Update permission status
     */
    fun updatePermissionStatus(permissionStatus: PermissionStatus) {
        val current = getPreferences()
        savePreferences(current.copy(permissionsGranted = permissionStatus))
    }

    /**
     * Get permission status
     */
    fun getPermissionStatus(): PermissionStatus {
        return getPreferences().permissionsGranted
    }

    /**
     * Update single permission
     */
    fun updatePermission(permission: String, state: PermissionState) {
        val current = getPermissionStatus()
        val updated = when (permission.lowercase()) {
            "camera" -> current.copy(camera = state)
            "microphone", "mic" -> current.copy(microphone = state)
            "location" -> current.copy(location = state)
            "location_always" -> current.copy(locationAlways = state)
            "storage" -> current.copy(storage = state)
            "notifications" -> current.copy(notifications = state)
            else -> current
        }
        updatePermissionStatus(updated)
    }

    /**
     * Get user's interests
     */
    fun getUserInterests(): List<UserInterest> {
        return getPreferences().interests
    }

    /**
     * Get user's experience level
     */
    fun getExperienceLevel(): ExperienceLevel {
        return getPreferences().experienceLevel
    }

    /**
     * Get user's favorite environments
     */
    fun getFavoriteEnvironments(): List<Environment> {
        return getPreferences().favoriteEnvironments
    }

    /**
     * Get recommended species categories based on user interests
     */
    fun getRecommendedCategories(): List<SpeciesCategory> {
        val interests = getUserInterests()
        return UserInterest.getRecommendedCategories(interests)
    }

    /**
     * Get detail level for species information
     */
    fun getDetailLevel(): DetailLevel {
        return getExperienceLevel().getDetailLevel()
    }

    /**
     * Reset preferences (for testing/debugging)
     */
    fun clearPreferences() {
        settings.remove(KEY_USER_PREFERENCES)
        settings.remove(KEY_ONBOARDING_COMPLETED)
        settings.remove(KEY_ONBOARDING_VERSION)
        settings.remove(KEY_PERMISSIONS_STATUS)
    }

    /**
     * Check if specific permission is granted
     */
    fun isPermissionGranted(permission: String): Boolean {
        val status = getPermissionStatus()
        return when (permission.lowercase()) {
            "camera" -> status.camera == PermissionState.GRANTED
            "microphone", "mic" -> status.microphone == PermissionState.GRANTED
            "location" -> status.location == PermissionState.GRANTED
            "location_always" -> status.locationAlways == PermissionState.GRANTED
            "storage" -> status.storage == PermissionState.GRANTED
            "notifications" -> status.notifications == PermissionState.GRANTED
            else -> false
        }
    }

    /**
     * Check if all required permissions are granted
     */
    fun hasRequiredPermissions(): Boolean {
        return getPermissionStatus().hasRequiredPermissions()
    }

    /**
     * Get list of missing permissions
     */
    fun getMissingPermissions(): Pair<List<String>, List<String>> {
        val status = getPermissionStatus()
        return Pair(
            status.getMissingCriticalPermissions(),
            status.getMissingOptionalPermissions()
        )
    }
}
