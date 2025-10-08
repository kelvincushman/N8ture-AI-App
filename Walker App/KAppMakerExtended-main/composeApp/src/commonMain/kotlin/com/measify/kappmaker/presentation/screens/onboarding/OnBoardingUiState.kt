package com.measify.kappmaker.presentation.screens.onboarding

import com.measify.kappmaker.designsystem.generated.resources.ic_logo
import com.measify.kappmaker.generated.resources.Res
import com.measify.kappmaker.generated.resources.desc_onboarding_page_1
import com.measify.kappmaker.generated.resources.screenshot_example_onboarding_phone_mockup
import com.measify.kappmaker.generated.resources.title_onboarding_page_1
import org.jetbrains.compose.resources.DrawableResource
import org.jetbrains.compose.resources.StringResource
import com.measify.kappmaker.designsystem.generated.resources.UiRes


data class OnBoardingScreenData(
    val title: StringResource,
    val description: StringResource,
    val imageRes: DrawableResource
)

data class OnBoardingUiState(

    val pages: List<OnBoardingScreenData> = listOf(
        OnBoardingScreenData(
            Res.string.title_onboarding_page_1,
            Res.string.desc_onboarding_page_1,
            Res.drawable.screenshot_example_onboarding_phone_mockup
        ),
        OnBoardingScreenData(
            Res.string.title_onboarding_page_1,
            Res.string.desc_onboarding_page_1,
            UiRes.drawable.ic_logo
        ),
        OnBoardingScreenData(
            Res.string.title_onboarding_page_1,
            Res.string.desc_onboarding_page_1,
            UiRes.drawable.ic_logo
        ),
    ),
    val onBoardIsShown: Boolean = false,
    val isLoading: Boolean = true
)

sealed class OnBoardingUiEvent {
    data object OnClickStart : OnBoardingUiEvent()
}

