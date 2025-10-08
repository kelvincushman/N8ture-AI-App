package com.measify.kappmaker.presentation.screens.paywall

import androidx.compose.runtime.Composable
import com.measify.kappmaker.data.source.featureflag.FeatureFlagManager
import com.measify.kappmaker.presentation.screens.paywall.remotepaywall.RemotePaywallScreen
import com.measify.kappmaker.root.LocalNavigator
import com.measify.kappmaker.presentation.screens.signin.SignInScreenRoute
import com.measify.kappmaker.util.ScreenRoute
import com.measify.kappmaker.util.uiStateHolder
import kotlinx.serialization.Serializable
import org.koin.compose.koinInject

@Serializable
class PaywallScreenRoute : ScreenRoute {
    @Composable
    override fun Content() {
        val navigator = LocalNavigator.current
        val featureFlagManager = koinInject<FeatureFlagManager>()
        if (featureFlagManager.getBoolean(FeatureFlagManager.Keys.SHOW_REMOTE_PAYWALL)) {
            RemotePaywallScreen(onDismiss = { navigator.popBackStack() })
        } else {
            val uiStateHolder = uiStateHolder<PaywallUiStateHolder>()
            PaywallScreen(
                uiStateHolder = uiStateHolder,
                onDismiss = { navigator.popBackStack() },
                onSignInRequired = {
                    navigator.navigate(SignInScreenRoute())
                }
            )
        }
    }

}


