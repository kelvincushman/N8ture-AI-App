package com.measify.kappmaker.domain.model

import kotlinx.serialization.Serializable

/**
 * Represents the freemium trial state for the user
 */
@Serializable
data class TrialState(
    val remainingIdentifications: Int,
    val maxTrialIdentifications: Int = MAX_TRIAL_COUNT,
    val isTrialExpired: Boolean = remainingIdentifications <= 0,
    val firstUseTimestamp: Long? = null
) {
    companion object {
        const val MAX_TRIAL_COUNT = 3

        /**
         * Create a new trial state for first-time users
         */
        fun new(): TrialState = TrialState(
            remainingIdentifications = MAX_TRIAL_COUNT,
            maxTrialIdentifications = MAX_TRIAL_COUNT,
            isTrialExpired = false,
            firstUseTimestamp = null
        )
    }

    /**
     * Check if user can perform an identification
     */
    fun canIdentify(): Boolean = remainingIdentifications > 0

    /**
     * Get trial progress as percentage (0-100)
     */
    fun getProgressPercentage(): Float =
        (remainingIdentifications.toFloat() / maxTrialIdentifications.toFloat()) * 100f

    /**
     * Decrease trial count by 1
     */
    fun useIdentification(): TrialState = copy(
        remainingIdentifications = (remainingIdentifications - 1).coerceAtLeast(0),
        isTrialExpired = remainingIdentifications - 1 <= 0,
        firstUseTimestamp = firstUseTimestamp ?: System.currentTimeMillis()
    )
}

/**
 * Subscription status for premium features
 */
@Serializable
data class SubscriptionStatus(
    val isActive: Boolean = false,
    val isPremium: Boolean = false,
    val subscriptionType: SubscriptionType = SubscriptionType.FREE,
    val expirationDate: Long? = null
)

@Serializable
enum class SubscriptionType {
    FREE,
    MONTHLY,
    ANNUAL
}