package com.measify.kappmaker.util

import androidx.compose.runtime.Composable
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavHostController
import kotlinx.coroutines.CoroutineScope
import org.koin.compose.currentKoinScope
import org.koin.compose.viewmodel.koinNavViewModel
import org.koin.compose.viewmodel.koinViewModel
import org.koin.core.annotation.KoinExperimentalAPI
import org.koin.core.parameter.ParametersDefinition
import org.koin.core.qualifier.Qualifier
import org.koin.core.scope.Scope

abstract class UiStateHolder : ViewModel()

val UiStateHolder.uiStateHolderScope: CoroutineScope get() = viewModelScope


@Composable
inline fun <reified T : ViewModel> ScreenRoute.uiStateHolder(
    qualifier: Qualifier? = null,
    scope: Scope = currentKoinScope(),
    noinline parameters: ParametersDefinition? = null
): T {
    return koinViewModel(qualifier = qualifier, scope = scope, parameters = parameters)
}

@OptIn(KoinExperimentalAPI::class)
@Composable
inline fun <reified T : ViewModel> NavHostController.navigatorUiStateHolder(
    qualifier: Qualifier? = null,
    scope: Scope = currentKoinScope(),
    noinline parameters: ParametersDefinition? = null
): T {
    return koinNavViewModel(qualifier=qualifier,scope=scope,parameters=parameters)
}
