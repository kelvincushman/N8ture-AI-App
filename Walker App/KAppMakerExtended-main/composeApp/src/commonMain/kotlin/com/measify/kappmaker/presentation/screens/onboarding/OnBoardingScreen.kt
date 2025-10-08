package com.measify.kappmaker.presentation.screens.onboarding

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.measify.kappmaker.designsystem.components.LogoImage


enum class OnBoardingScreenStyle {
    STYLE1,
    STYLE2
}

@Composable
fun OnBoardingScreen(
    modifier: Modifier = Modifier,
    style: OnBoardingScreenStyle = OnBoardingScreenStyle.STYLE2,
    uiStateHolder: OnBoardingUiStateHolder,
    onNavigateMain: () -> Unit,
) {
    val uiState by uiStateHolder.uiState.collectAsStateWithLifecycle()

    if (uiState.onBoardIsShown) {
        LaunchedEffect(uiState.onBoardIsShown) {
            onNavigateMain()
        }
    }
    if (uiState.isLoading) {
        LogoImage(modifier = modifier.fillMaxSize())
    } else {
        when (style) {
            OnBoardingScreenStyle.STYLE1 -> {
                OnBoardingScreenVariation1(
                    modifier = modifier.fillMaxSize(),
                    uiState = uiState,
                    onUiEvent = uiStateHolder::onUiEvent
                )
            }

            OnBoardingScreenStyle.STYLE2 -> {
                OnBoardingScreenVariation2(
                    modifier = modifier.fillMaxSize(),
                    uiState = uiState,
                    onUiEvent = uiStateHolder::onUiEvent
                )
            }
        }
    }
}



