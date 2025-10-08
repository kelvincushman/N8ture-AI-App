package com.measify.kappmaker.presentation.screens.account

import com.measify.kappmaker.data.repository.SubscriptionRepository
import com.measify.kappmaker.data.repository.UserRepository
import com.measify.kappmaker.designsystem.components.SettingsItemUiState
import com.measify.kappmaker.designsystem.generated.resources.ic_settings_item_logout
import com.measify.kappmaker.designsystem.generated.resources.ic_settings_item_subscriptions
import com.measify.kappmaker.designsystem.generated.resources.ic_settings_item_support_legal
import com.measify.kappmaker.domain.model.isFree
import com.measify.kappmaker.generated.resources.Res
import com.measify.kappmaker.generated.resources.help_and_support
import com.measify.kappmaker.generated.resources.logout
import com.measify.kappmaker.generated.resources.subscriptions
import com.measify.kappmaker.util.UiStateHolder
import com.measify.kappmaker.util.uiStateHolderScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted.Companion.WhileSubscribed
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import com.measify.kappmaker.designsystem.generated.resources.UiRes

class AccountUiStateHolder(
    private val userRepository: UserRepository,
    private val subscriptionRepository: SubscriptionRepository
) : UiStateHolder() {

    private val allSettingsItemList: List<SettingsItemUiState> = listOf(
        SettingsItemUiState(
            startIcon = UiRes.drawable.ic_settings_item_subscriptions,
            textRes = Res.string.subscriptions
        ),

        SettingsItemUiState(
            startIcon = UiRes.drawable.ic_settings_item_support_legal,
            textRes = Res.string.help_and_support
        ),

        SettingsItemUiState(
            startIcon = UiRes.drawable.ic_settings_item_logout,
            textRes = Res.string.logout,
            showEndIcon = false,
        ),
    )

    private val _uiState = MutableStateFlow(AccountUiState())
    val uiState: StateFlow<AccountUiState> =
        combine(
            userRepository.currentUser,
            subscriptionRepository.currentSubscriptionFlow,
            _uiState
        ) { currentUser, currentSubscription, uiState ->
            val user = currentUser.getOrNull()
            uiState.copy(
                user = if (user?.isAnonymous == true) null else user,
                settingsItemList =
                    if (user != null) allSettingsItemList
                    else allSettingsItemList.subList(0, allSettingsItemList.size - 1),
                showUpgradePremiumBanner = currentSubscription.isFree
            )
        }.stateIn(uiStateHolderScope, WhileSubscribed(5000), _uiState.value)


    fun onUiEvent(event: AccountUiEvent) = uiStateHolderScope.launch {
        when (event) {

            AccountUiEvent.OnLogoutConfirmClick -> {
                userRepository.logOut()
                _uiState.update { it.copy(isLogoutDialogVisible = false) }
            }

            AccountUiEvent.OnLogoutDialogDismiss -> {
                _uiState.update { it.copy(isLogoutDialogVisible = false) }
            }

            is AccountUiEvent.OnSettingsItemClick -> {
                when (event.item.textRes) {
                    Res.string.logout -> {
                        _uiState.update { it.copy(isLogoutDialogVisible = true) }
                    }

                    else -> {}
                }
            }

            AccountUiEvent.OnClickUpgradePremium -> Unit
            AccountUiEvent.OnClickProfile -> Unit
            AccountUiEvent.OnClickSignIn -> Unit
        }

    }
}