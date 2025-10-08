package com.measify.kappmaker.presentation.screens.onboarding

import com.measify.kappmaker.data.source.preferences.UserPreferences
import com.measify.kappmaker.util.UiStateHolder
import com.measify.kappmaker.util.uiStateHolderScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch


class OnBoardingUiStateHolder(private val userPreferences: UserPreferences) : UiStateHolder() {
    private val _uiState = MutableStateFlow(OnBoardingUiState(isLoading = true))
    val uiState: StateFlow<OnBoardingUiState> = _uiState.asStateFlow()

    init {
        checkIfOnBoardIsShown()
    }

    private fun checkIfOnBoardIsShown() = uiStateHolderScope.launch {
        _uiState.update { it.copy(isLoading = true) }
        if (userPreferences.getBoolean(UserPreferences.KEY_IS_ONBOARD_SHOWN)) {
            _uiState.update { it.copy(onBoardIsShown = true) }
        } else
            _uiState.update { it.copy(onBoardIsShown = false, isLoading = false) }

    }



    fun onUiEvent(event: OnBoardingUiEvent) = uiStateHolderScope.launch {
        when (event) {
            OnBoardingUiEvent.OnClickStart -> {
                onBoardShown()
            }
        }
    }

    private suspend fun onBoardShown() {
        _uiState.update { it.copy(isLoading = true) }
        userPreferences.putBoolean(UserPreferences.KEY_IS_ONBOARD_SHOWN, true)
        _uiState.update { it.copy(onBoardIsShown = true, isLoading = false) }
    }

}

