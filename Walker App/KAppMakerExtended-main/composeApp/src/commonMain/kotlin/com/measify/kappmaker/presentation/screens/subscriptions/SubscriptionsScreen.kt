package com.measify.kappmaker.presentation.screens.subscriptions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.measify.kappmaker.designsystem.components.LoadingProgress
import com.measify.kappmaker.designsystem.components.LoadingProgressMode
import com.measify.kappmaker.designsystem.components.premium.CurrentSubscriptionPlanAndFeatures
import com.measify.kappmaker.designsystem.components.premium.ManageSubscriptionText
import com.measify.kappmaker.designsystem.components.premium.UpgradePremiumBanner
import com.measify.kappmaker.designsystem.components.premium.UpgradePremiumBannerStyle
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.domain.model.Subscription
import com.measify.kappmaker.presentation.components.premium.PremiumFeatureFactory
import com.measify.kappmaker.util.Constants.subscriptionUrl
import com.measify.kappmaker.util.extensions.asFormattedDate

@Composable
fun SubscriptionsScreen(
    modifier: Modifier = Modifier,
    uiStateHolder: SubscriptionsUiStateHolder,
    onNavigatePaywall: () -> Unit,

    ) {

    val uiState by uiStateHolder.uiState.collectAsStateWithLifecycle()

    if (uiState.isLoading) LoadingProgress(mode = LoadingProgressMode.FULLSCREEN)
    else {
        SubscriptionsScreen(
            modifier = modifier.fillMaxSize().background(AppTheme.colors.background),
            uiState = uiState,
            onUiEvent = uiStateHolder::onUiEvent,
            onClickUpgradePremium = { onNavigatePaywall() }
        )
    }
}

@Composable
fun SubscriptionsScreen(
    modifier: Modifier = Modifier,
    uiState: SubscriptionsUiState,
    onUiEvent: (SubscriptionsUiEvent) -> Unit,
    onClickUpgradePremium: () -> Unit = {},
) {
    val topPadding =
        if (uiState.showUpgradePremiumBanner) AppTheme.spacing.cardContentSpacing
        else AppTheme.spacing.defaultSpacing
    Column(
        modifier = modifier
            .padding(horizontal = AppTheme.spacing.outerSpacing)
            .verticalScroll(rememberScrollState())
            .padding(
                top = topPadding,
                bottom = AppTheme.spacing.outerSpacing
            ),
        verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.sectionSpacing)
    ) {

        if (uiState.showUpgradePremiumBanner) {
            UpgradePremiumBanner(
                style = UpgradePremiumBannerStyle.LARGE,
                onClick = { onClickUpgradePremium() })
        }

        CurrentSubscriptionPlanAndFeatures(
            name = uiState.currentPlan?.name ?: "Free",
            features = PremiumFeatureFactory.ofSubscription(uiState.currentPlan),
            price = uiState.currentPlan?.formattedPrice,
            duration = when (uiState.currentPlan?.durationType) {
                Subscription.DurationType.MONTHLY -> "month"
                Subscription.DurationType.WEEKLY -> "week"
                Subscription.DurationType.YEARLY -> "year"
                Subscription.DurationType.LIFETIME -> "lifetime"
                else -> null
            },
        )

        if (uiState.currentPlan != null)
            ManageSubscriptionText(
                isLifetime = uiState.currentPlan.isLifetime,
                isRecurring = uiState.currentPlan.willRenew,
                expirationDate = uiState.currentPlan.expirationDateInMillis?.asFormattedDate(),
                subscriptionUrl = subscriptionUrl
            )

    }
}






