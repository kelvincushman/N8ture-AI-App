package com.measify.kappmaker.presentation.screens.main

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.snap
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import com.measify.kappmaker.designsystem.components.AppToolbar
import com.measify.kappmaker.designsystem.components.bottomnav.BottomNavigationBar
import com.measify.kappmaker.util.extensions.isKeyboardOpen
import org.jetbrains.compose.resources.painterResource


@Composable
fun MainScreen(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
    mainScreenUiState: MainScreenUiState = MainScreenUiState(),
    onUiEvent: (MainScreenUiEvent) -> Unit = {},
) {
    Box(modifier = modifier) {
        Column(modifier = Modifier.fillMaxSize()) {
            //AppBar
            if (mainScreenUiState.toolbarUiState.isVisible) {
                AppToolbar(
                    title = mainScreenUiState.toolbarUiState.text,
                    navigationIcon = mainScreenUiState.toolbarUiState.navigationIconRes?.let {
                        painterResource(it)
                    },
                    onNavigationIconClick = { onUiEvent(MainScreenUiEvent.OnToolbarNavItemClick) }
                )
            }
            //Main Content
            Box(modifier = Modifier.weight(1f).padding(mainScreenUiState.contentPadding)) {
                content()
            }

            //BottomNavigation Bar
            val isBottomNavVisible =
                mainScreenUiState.bottomNavUiState.isVisible && !isKeyboardOpen()
            val bottomNavItems =
                remember { mainScreenUiState.bottomNavUiState.items.map { it.first } }
            AnimatedVisibility(isBottomNavVisible, enter = fadeIn(snap()), exit = fadeOut(snap())) {
                BottomNavigationBar(
                    modifier = Modifier.fillMaxWidth(),
                    items = bottomNavItems,
                    selectedIndex = mainScreenUiState.bottomNavUiState.selectedBottomNavIndex
                ) {
                    onUiEvent(MainScreenUiEvent.OnBottomNavItemClick(it))
                }
            }
        }
    }
}


