package com.measify.kappmaker.presentation.screens.profile

import androidx.compose.runtime.Composable
import com.measify.kappmaker.presentation.screens.signin.SignInScreenRoute
import com.measify.kappmaker.root.LocalNavigator
import com.measify.kappmaker.util.ScreenRoute
import com.measify.kappmaker.util.navigatorUiStateHolder
import kotlinx.serialization.Serializable

@Serializable
class ProfileScreenRoute : ScreenRoute {
    @Composable
    override fun Content() {
        val navigator = LocalNavigator.current
        /*
            Use  as below for scoping uiStateHolder to the screen instead of navigation
            val uiStateHolder = uiStateHolder<ProfileUiStateHolder>()
         */
        val uiStateHolder = navigator.navigatorUiStateHolder<ProfileUiStateHolder>()
        ProfileScreen(uiStateHolder = uiStateHolder, onSignInRequired = {
            navigator.navigate(SignInScreenRoute()){
                popUpTo(ProfileScreenRoute()){
                    inclusive = true
                }
            }
        })
    }
}