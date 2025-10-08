package com.measify.kappmaker.presentation.components.premium

import com.measify.kappmaker.designsystem.components.premium.PremiumFeatureUiState
import com.measify.kappmaker.domain.model.Subscription
import com.measify.kappmaker.domain.model.isFree


//TODO Add default features here
object PremiumFeatureFactory {
    val defaultFreeFeatures: List<PremiumFeatureUiState>
        get() = listOf(
            PremiumFeatureUiState("Access to free features only"),
            PremiumFeatureUiState("Access to premium features", isIncluded = false),
        )
    val defaultPremiumFeatures: List<PremiumFeatureUiState>
        get() = listOf(
            PremiumFeatureUiState("Access to premium features"),
        )

    fun ofSubscription(subscription: Subscription?): List<PremiumFeatureUiState> {
        return if (subscription.isFree) defaultFreeFeatures
        else (subscription?.benefits?.map { PremiumFeatureUiState(it) } ?: emptyList())
            .ifEmpty { defaultPremiumFeatures }
    }
}



