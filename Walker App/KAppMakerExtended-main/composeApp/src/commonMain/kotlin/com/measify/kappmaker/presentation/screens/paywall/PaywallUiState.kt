package com.measify.kappmaker.presentation.screens.paywall

import com.measify.kappmaker.domain.model.Subscription
import com.measify.kappmaker.util.UiMessage
import com.revenuecat.purchases.kmp.models.Package

data class PaywallUiState(
    val title: String = "Go Premium",
    val buyButtonText: String = "Buy Now",
    val features: List<String> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: UiMessage? = null,
    val selectedPackage: Package? = null,
    val buyButtonEnabled: Boolean = false,
    val packages: List<Package> = emptyList(),
    val successfulSubscription: Subscription? = null,
    val signInActionRequired: Boolean = false
)

sealed class PaywallUiEvent {
    data object OnClickBuy : PaywallUiEvent()
    data object OnClickRestore : PaywallUiEvent()
    data class OnSelectPackage(val rcPackage: Package) : PaywallUiEvent()
}

