package com.measify.kappmaker.presentation.screens.account

import androidx.compose.runtime.Composable
import com.measify.kappmaker.presentation.screens.helpandsupport.HelpAndSupportScreenRoute
import com.measify.kappmaker.presentation.screens.paywall.PaywallScreenRoute
import com.measify.kappmaker.presentation.screens.profile.ProfileScreenRoute
import com.measify.kappmaker.presentation.screens.signin.SignInScreenRoute
import com.measify.kappmaker.root.LocalNavigator
import com.measify.kappmaker.presentation.screens.subscriptions.SubscriptionsScreenRoute
import com.measify.kappmaker.util.ScreenRoute
import com.measify.kappmaker.util.uiStateHolder
import kotlinx.serialization.Serializable

@Serializable
class AccountScreenRoute : ScreenRoute {

    @Composable
    override fun Content() {
        val uiStateHolder = uiStateHolder<AccountUiStateHolder>()
        val navigator = LocalNavigator.current
        AccountScreen(
            uiStateHolder = uiStateHolder,
            onNavigateHelpAndSupport = {
                navigator.navigate(HelpAndSupportScreenRoute())
            },
            onNavigatePaywall = {
                navigator.navigate(PaywallScreenRoute())
            },
            onNavigateSignIn = {
                navigator.navigate(SignInScreenRoute())
            },
            onNavigateProfile = {
                navigator.navigate(ProfileScreenRoute())
            },
            onNavigateSubscriptions = {
                navigator.navigate(SubscriptionsScreenRoute())
            }
        )
    }

}