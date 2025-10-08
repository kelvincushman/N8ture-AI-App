package com.measify.kappmaker.presentation.screens.signin

import androidx.compose.runtime.Composable
import com.measify.kappmaker.root.LocalNavigator
import com.measify.kappmaker.util.ScreenRoute
import kotlinx.serialization.Serializable

@Serializable
class SignInScreenRoute : ScreenRoute {

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.current
        SignInScreen(onSuccessfulSignIn = {
            navigator.popBackStack()
        })
    }
}