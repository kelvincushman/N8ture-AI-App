package com.measify.kappmaker.presentation.screens.subscriptions

import androidx.compose.runtime.Composable
import com.measify.kappmaker.presentation.screens.paywall.PaywallScreenRoute
import com.measify.kappmaker.root.LocalNavigator
import com.measify.kappmaker.util.ScreenRoute
import com.measify.kappmaker.util.uiStateHolder
import kotlinx.serialization.Serializable

@Serializable
class SubscriptionsScreenRoute : ScreenRoute {

    @Composable
    override fun Content() {
        val uiStateHolder = uiStateHolder<SubscriptionsUiStateHolder>()
        val navigator = LocalNavigator.current
        SubscriptionsScreen(
            uiStateHolder = uiStateHolder,
            onNavigatePaywall = {
                navigator.navigate(PaywallScreenRoute())
            })
    }
}