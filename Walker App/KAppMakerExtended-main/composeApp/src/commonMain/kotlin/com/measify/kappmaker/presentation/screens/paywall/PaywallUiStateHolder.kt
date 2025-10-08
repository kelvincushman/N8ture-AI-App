package com.measify.kappmaker.presentation.screens.paywall

import com.measify.kappmaker.data.repository.SubscriptionRepository
import com.measify.kappmaker.data.repository.UserRepository
import com.measify.kappmaker.designsystem.components.premium.PremiumFeatureUiState
import com.measify.kappmaker.presentation.components.premium.PremiumFeatureFactory
import com.measify.kappmaker.root.AppGlobalUiState
import com.measify.kappmaker.util.UiMessage
import com.measify.kappmaker.util.UiStateHolder
import com.measify.kappmaker.util.extensions.asPremiumSubscription
import com.measify.kappmaker.util.extensions.buttonText
import com.measify.kappmaker.util.logging.AppLogger
import com.measify.kappmaker.util.uiStateHolderScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch


class PaywallUiStateHolder(
    private val subscriptionRepository: SubscriptionRepository,
    private val userRepository: UserRepository
) :
    UiStateHolder() {
    private val _uiState = MutableStateFlow(PaywallUiState())
    val uiState: StateFlow<PaywallUiState> = _uiState.asStateFlow()


    init {
        getPackages()
    }

    fun onMessageShown() {
        _uiState.update { it.copy(errorMessage = null) }
    }

    fun onSuccessfulPurchaseHandled() = uiStateHolderScope.launch {
        _uiState.update { it.copy(successfulSubscription = null) }
    }

    fun onSignInActionHandled() = uiStateHolderScope.launch {
        _uiState.update { it.copy(signInActionRequired = false) }
    }

    private fun getPackages() = uiStateHolderScope.launch {
        _uiState.update { it.copy(isLoading = true) }
        subscriptionRepository.getPackageList()
            .onSuccess { packages ->
                val defaultSelectedPackageIndex = 0
                val selectedPackage = packages.getOrNull(defaultSelectedPackageIndex)
                // You can change features dynamically based on selected package
                val features = PremiumFeatureFactory.defaultPremiumFeatures.map { it.text }
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        features = features,
                        packages = packages,
                        selectedPackage = selectedPackage,
                        buyButtonEnabled = selectedPackage != null,
                        buyButtonText = selectedPackage.buttonText
                    )
                }
            }

            .onFailure { error ->
                AppLogger.e("Error getting packages: $error")
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = UiMessage.Message(error.message),
                        buyButtonEnabled = false
                    )
                }
            }
    }

    fun onUiEvent(event: PaywallUiEvent) {
        when (event) {
            PaywallUiEvent.OnClickBuy -> {
                buyPackage()
            }

            PaywallUiEvent.OnClickRestore -> {
                restorePayment()
            }

            is PaywallUiEvent.OnSelectPackage -> {
                _uiState.update {
                    it.copy(
                        selectedPackage = event.rcPackage,
                        buyButtonEnabled = true,
                        buyButtonText = event.rcPackage.buttonText
                    )
                }
            }
        }
    }

    private fun restorePayment() = uiStateHolderScope.launch {

        if (userCanDoPaymentAction().not()) {
            AppGlobalUiState.showUiMessage(UiMessage.Message("You need to sign in first"))
            _uiState.update { it.copy(signInActionRequired = true) }
            return@launch
        }

        _uiState.update { it.copy(isLoading = true) }
        subscriptionRepository.restorePurchase()
            .onSuccess { customerInfo ->
                _uiState.update { state ->
                    state.copy(
                        isLoading = false,
                        successfulSubscription = customerInfo.asPremiumSubscription()
                    )
                }
                AppLogger.d("Successful restoring purchase: $customerInfo")
            }
            .onFailure { error ->
                AppLogger.e("Error restoring purchases: $error")
                _uiState.update { state ->
                    state.copy(
                        errorMessage = UiMessage.Message(error.message),
                        isLoading = false
                    )
                }
            }

    }

    private fun buyPackage() = uiStateHolderScope.launch {
        if (userCanDoPaymentAction().not()) {
            AppGlobalUiState.showUiMessage(UiMessage.Message("You need to sign in first"))
            _uiState.update { it.copy(signInActionRequired = true) }
            return@launch
        }
        val selectedPackage = uiState.value.selectedPackage
        if (selectedPackage != null) {
            _uiState.update { it.copy(buyButtonEnabled = false) }
            subscriptionRepository.purchase(selectedPackage)
                .onSuccess { successfulPurchase ->
                    _uiState.update {
                        it.copy(
                            buyButtonEnabled = true,
                            successfulSubscription = successfulPurchase.customerInfo.asPremiumSubscription()
                        )
                    }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(
                            buyButtonEnabled = true,
                            errorMessage = UiMessage.Message(error.message)
                        )
                    }
                }

        }
    }

    private suspend fun userCanDoPaymentAction(): Boolean {
        //You can for example check if user is authenticated here
        val currentUser = userRepository.currentUser.first().getOrNull()
        return currentUser != null
    }

}

