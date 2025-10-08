package com.measify.kappmaker.presentation.screens.subscriptions

import com.measify.kappmaker.domain.model.Subscription

data class SubscriptionsUiState(
    val isLoading: Boolean = false,
    val showUpgradePremiumBanner: Boolean = true,
    val currentPlan: Subscription? = null
)

sealed class SubscriptionsUiEvent {

}