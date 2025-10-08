package com.measify.kappmaker.data.source.local

import com.measify.kappmaker.domain.model.TrialState
import com.russhwolf.settings.Settings
import com.russhwolf.settings.get
import com.russhwolf.settings.set

/**
 * Manages freemium trial state for N8ture AI App
 * Tracks remaining free identifications (max 3)
 */
class TrialManager(private val settings: Settings) {

    companion object {
        private const val KEY_TRIAL_COUNT = "n8ture_trial_count"
        private const val KEY_FIRST_USE_TIMESTAMP = "n8ture_first_use_timestamp"
        private const val KEY_MAX_TRIAL_COUNT = "n8ture_max_trial_count"
        private const val DEFAULT_MAX_TRIALS = 3
    }

    /**
     * Get current trial state
     */
    fun getTrialState(): TrialState {
        val remainingTrials = settings.getInt(KEY_TRIAL_COUNT, DEFAULT_MAX_TRIALS)
        val maxTrials = settings.getInt(KEY_MAX_TRIAL_COUNT, DEFAULT_MAX_TRIALS)
        val firstUseTimestamp = settings.getLongOrNull(KEY_FIRST_USE_TIMESTAMP)

        return TrialState(
            remainingIdentifications = remainingTrials,
            maxTrialIdentifications = maxTrials,
            isTrialExpired = remainingTrials <= 0,
            firstUseTimestamp = firstUseTimestamp
        )
    }

    /**
     * Get remaining trial identifications
     */
    fun getRemainingTrials(): Int {
        return settings.getInt(KEY_TRIAL_COUNT, DEFAULT_MAX_TRIALS)
    }

    /**
     * Use one trial identification
     * @return true if identification was used, false if no trials remaining
     */
    fun useTrialIdentification(): Boolean {
        val remaining = getRemainingTrials()
        if (remaining > 0) {
            val newCount = remaining - 1
            settings.putInt(KEY_TRIAL_COUNT, newCount)

            // Set first use timestamp if not already set
            if (settings.getLongOrNull(KEY_FIRST_USE_TIMESTAMP) == null) {
                settings.putLong(KEY_FIRST_USE_TIMESTAMP, System.currentTimeMillis())
            }

            return true
        }
        return false
    }

    /**
     * Check if trial is expired (no identifications remaining)
     */
    fun isTrialExpired(): Boolean {
        return getRemainingTrials() <= 0
    }

    /**
     * Check if user can perform an identification
     */
    fun canIdentify(): Boolean {
        return !isTrialExpired()
    }

    /**
     * Reset trial (for testing purposes)
     * Should be removed or restricted in production
     */
    fun resetTrial() {
        settings.putInt(KEY_TRIAL_COUNT, DEFAULT_MAX_TRIALS)
        settings.remove(KEY_FIRST_USE_TIMESTAMP)
    }

    /**
     * Get first use timestamp
     */
    fun getFirstUseTimestamp(): Long? {
        return settings.getLongOrNull(KEY_FIRST_USE_TIMESTAMP)
    }

    /**
     * Set custom max trial count (for A/B testing)
     */
    fun setMaxTrialCount(count: Int) {
        settings.putInt(KEY_MAX_TRIAL_COUNT, count)
    }
}

// Extension functions for Settings
private fun Settings.getLongOrNull(key: String): Long? {
    return if (hasKey(key)) getLong(key, 0L) else null
}