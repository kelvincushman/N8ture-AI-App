package com.measify.kappmaker.presentation.screens.helpandsupport

import androidx.compose.runtime.Composable
import com.measify.kappmaker.util.ScreenRoute
import kotlinx.serialization.Serializable

@Serializable
class HelpAndSupportScreenRoute : ScreenRoute {

    @Composable
    override fun Content() {
        HelpAndSupportScreen()
    }

}