package com.measify.kappmaker.presentation.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.AsyncImage
import coil3.compose.LocalPlatformContext
import coil3.request.ImageRequest
import coil3.request.crossfade
import com.measify.kappmaker.designsystem.components.AppCardContainer
import com.measify.kappmaker.designsystem.components.SettingItemListContainer
import com.measify.kappmaker.designsystem.components.SmallTitle
import com.measify.kappmaker.designsystem.components.modals.AppModalBottomSheet
import com.measify.kappmaker.designsystem.components.premium.UpgradePremiumBanner
import com.measify.kappmaker.designsystem.components.premium.UpgradePremiumBannerStyle
import com.measify.kappmaker.designsystem.generated.resources.btn_cancel
import com.measify.kappmaker.designsystem.generated.resources.btn_logout_confirm
import com.measify.kappmaker.designsystem.generated.resources.ic_arrow_right
import com.measify.kappmaker.designsystem.generated.resources.ic_profile_img_placeholder
import com.measify.kappmaker.designsystem.generated.resources.logout
import com.measify.kappmaker.designsystem.generated.resources.text_logout_confirmation
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.domain.model.User
import com.measify.kappmaker.generated.resources.Res
import com.measify.kappmaker.generated.resources.help_and_support
import com.measify.kappmaker.generated.resources.subscriptions
import com.measify.kappmaker.generated.resources.title_sign_in
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.resources.stringResource
import org.jetbrains.compose.resources.vectorResource
import com.measify.kappmaker.designsystem.generated.resources.UiRes

@Composable
fun AccountScreen(
    modifier: Modifier = Modifier,
    uiStateHolder: AccountUiStateHolder,
    onNavigateHelpAndSupport: () -> Unit,
    onNavigatePaywall: () -> Unit,
    onNavigateSignIn: () -> Unit,
    onNavigateProfile: () -> Unit,
    onNavigateSubscriptions: () -> Unit,
) {
    val uiState by uiStateHolder.uiState.collectAsStateWithLifecycle()

    if (uiState.isLogoutDialogVisible) {
        LogoutModalBottomSheet(
            onConfirm = { uiStateHolder.onUiEvent(AccountUiEvent.OnLogoutConfirmClick) },
            onDismiss = { uiStateHolder.onUiEvent(AccountUiEvent.OnLogoutDialogDismiss) }
        )
    }

    AccountScreen(
        modifier = modifier
            .fillMaxSize()
            .background(AppTheme.colors.background),
        uiState = uiState,
        onUiEvent = {
            when (it) {
                is AccountUiEvent.OnSettingsItemClick -> {
                    when (it.item.textRes) {
                        Res.string.help_and_support -> onNavigateHelpAndSupport()
                        Res.string.subscriptions -> onNavigateSubscriptions()
                        else -> uiStateHolder.onUiEvent(it)
                    }
                }

                is AccountUiEvent.OnClickUpgradePremium -> {
                    onNavigatePaywall()
                }

                AccountUiEvent.OnClickSignIn -> {
                    onNavigateSignIn()
                }

                AccountUiEvent.OnClickProfile -> {
                    onNavigateProfile()
                }

                else -> uiStateHolder.onUiEvent(it)
            }
        }
    )
}

@Composable
fun AccountScreen(
    modifier: Modifier = Modifier,
    uiState: AccountUiState,
    onUiEvent: (AccountUiEvent) -> Unit
) {
    Column(
        modifier = modifier
            .padding(horizontal = AppTheme.spacing.outerSpacing)
            .verticalScroll(rememberScrollState())
            .padding(top = AppTheme.spacing.defaultSpacing, bottom = AppTheme.spacing.outerSpacing),
        verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.sectionSpacing)
    ) {

        if (uiState.showUpgradePremiumBanner) {
            UpgradePremiumBanner(
                style = UpgradePremiumBannerStyle.SMALL,
                onClick = { onUiEvent(AccountUiEvent.OnClickUpgradePremium) })
        }

        ProfileInfoBox(user = uiState.user, onClick = {
            if (uiState.user == null) onUiEvent(AccountUiEvent.OnClickSignIn)
            else onUiEvent(AccountUiEvent.OnClickProfile)

        })
        SettingItemListContainer(
            itemList = uiState.settingsItemList,
            onClick = { onUiEvent(AccountUiEvent.OnSettingsItemClick(it)) }
        )

    }
}


@Composable
private fun ProfileInfoBox(user: User?, onClick: () -> Unit) {
    AppCardContainer(modifier = Modifier.fillMaxWidth(), onClick = onClick) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AppTheme.spacing.horizontalItemSpacing)
        ) {

            AsyncImage(
                model = ImageRequest.Builder(LocalPlatformContext.current)
                    .data(user?.photoUrl)
                    .crossfade(true)
                    .build(),
                placeholder = painterResource(com.measify.kappmaker.designsystem.generated.resources.UiRes.drawable.ic_profile_img_placeholder),
                error = painterResource(com.measify.kappmaker.designsystem.generated.resources.UiRes.drawable.ic_profile_img_placeholder),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.size(60.dp).clip(CircleShape),
            )

            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.groupedVerticalElementSpacingSmall)
            ) {
                val displayName =
                    if (user == null) stringResource(Res.string.title_sign_in) else user.displayName

                SmallTitle(text = displayName ?: "User Name")
                user?.email?.let { email ->
                    Text(
                        email,
                        style = AppTheme.typography.bodyMedium,
                        color = AppTheme.colors.text.secondary,
                        fontWeight = FontWeight.Medium
                    )
                }

            }

            Icon(
                modifier = Modifier.size(24.dp),
                imageVector = vectorResource(UiRes.drawable.ic_arrow_right),
                contentDescription = null,
                tint = AppTheme.colors.text.primary
            )

        }
    }
}

@Composable
private fun LogoutModalBottomSheet(
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    AppModalBottomSheet(
        title = stringResource(UiRes.string.logout),
        titleColor = AppTheme.colors.status.error,
        btnDismissText = stringResource(UiRes.string.btn_cancel),
        btnConfirmText = stringResource(UiRes.string.btn_logout_confirm),
        onConfirm = { onConfirm() },
        onDismiss = { onDismiss() },
        reverseButtonsOrder = true
    ) {
        Text(
            text = stringResource(UiRes.string.text_logout_confirmation),
            textAlign = TextAlign.Center,
            color = AppTheme.colors.text.primary,
            style = AppTheme.typography.h5
        )

    }
}
