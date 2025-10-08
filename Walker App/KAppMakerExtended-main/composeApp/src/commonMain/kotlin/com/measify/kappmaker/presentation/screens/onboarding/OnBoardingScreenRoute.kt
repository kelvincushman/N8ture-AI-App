package com.measify.kappmaker.presentation.screens.onboarding

import androidx.compose.runtime.Composable
import com.measify.kappmaker.presentation.screens.home.HomeScreenRoute
import com.measify.kappmaker.root.LocalNavigator
import com.measify.kappmaker.util.ScreenRoute
import com.measify.kappmaker.util.uiStateHolder
import kotlinx.serialization.Serializable

@Serializable
class OnBoardingScreenRoute : ScreenRoute {

    @Composable
    override fun Content() {
        val uiStateHolder = uiStateHolder<OnBoardingUiStateHolder>()
        val navigator = LocalNavigator.current
        OnBoardingScreen(
            style = OnBoardingScreenStyle.STYLE2,
            uiStateHolder = uiStateHolder,
            onNavigateMain = {
                navigator.navigate(HomeScreenRoute()) {
                    popUpTo(OnBoardingScreenRoute()) {
                        inclusive = true
                    }
                }
            }
        )
    }

}


