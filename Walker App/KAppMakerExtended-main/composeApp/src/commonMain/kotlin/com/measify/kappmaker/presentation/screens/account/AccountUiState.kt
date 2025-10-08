package com.measify.kappmaker.presentation.screens.account

import com.measify.kappmaker.designsystem.components.SettingsItemUiState
import com.measify.kappmaker.designsystem.generated.resources.ic_settings_item_logout
import com.measify.kappmaker.designsystem.generated.resources.ic_settings_item_subscriptions
import com.measify.kappmaker.designsystem.generated.resources.ic_settings_item_support_legal
import com.measify.kappmaker.domain.model.User
import com.measify.kappmaker.generated.resources.Res
import com.measify.kappmaker.generated.resources.help_and_support
import com.measify.kappmaker.generated.resources.logout
import com.measify.kappmaker.generated.resources.subscriptions
import com.measify.kappmaker.designsystem.generated.resources.UiRes

data class AccountUiState(
    val settingsItemList: List<SettingsItemUiState> = listOf(
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
    ),
    val user: User? = null,
    val isLogoutDialogVisible: Boolean = false,
    val showUpgradePremiumBanner: Boolean = false,
)

sealed class AccountUiEvent {
    data class OnSettingsItemClick(val item: SettingsItemUiState) : AccountUiEvent()
    data object OnLogoutConfirmClick : AccountUiEvent()
    data object OnLogoutDialogDismiss : AccountUiEvent()
    data object OnClickUpgradePremium : AccountUiEvent()
    data object OnClickSignIn : AccountUiEvent()
    data object OnClickProfile : AccountUiEvent()
}