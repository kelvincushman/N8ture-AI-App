package com.measify.kappmaker.root

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.measify.kappmaker.designsystem.AllComponentsGallery
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.util.UiMessage
import com.measify.kappmaker.util.extensions.ObserveFlowAsEvent
import com.measify.kappmaker.util.logging.AppLogger
import com.measify.kappmaker.util.logging.logAppOpened
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.receiveAsFlow

@Composable
internal fun App() {
    AppTheme() {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.safeDrawing),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            //Set this to true for showing app, or false for ui components gallery
            val isPreviewComponentsMode = false
            if (isPreviewComponentsMode) AllComponentsGallery()
            else AppScaffold()
        }
    }
}

@Composable
private fun AppScaffold() {
    val snackbarHostState = remember { SnackbarHostState() }
    var uiMessage by remember { mutableStateOf<UiMessage?>(null) }

    ObserveFlowAsEvent(AppGlobalUiState.uiMessageFlow) { uiMessage = it }
    LaunchedEffect(Unit) {
        AppLogger.logAppOpened()
    }

    uiMessage?.value?.let { message ->
        LaunchedEffect(message) {
            snackbarHostState.showSnackbar(message = message)
            uiMessage = null
        }
    }
    Scaffold(snackbarHost = { SnackbarHost(hostState = snackbarHostState) }) {
        AppNavigation()
    }

}

object AppGlobalUiState {
    private val uiMessageChannel = Channel<UiMessage>(Channel.BUFFERED)
    val uiMessageFlow = uiMessageChannel.receiveAsFlow()

    fun showUiMessage(uiMessage: UiMessage) {
        uiMessageChannel.trySend(uiMessage)
    }
}
