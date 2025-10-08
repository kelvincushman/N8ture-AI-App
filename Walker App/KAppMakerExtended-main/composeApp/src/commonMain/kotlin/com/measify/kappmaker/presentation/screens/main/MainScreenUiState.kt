package com.measify.kappmaker.presentation.screens.main

import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.designsystem.components.bottomnav.BottomNavItem
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.ic_back
import com.measify.kappmaker.util.ScreenRoute
import org.jetbrains.compose.resources.DrawableResource


data class MainScreenUiState(
    val bottomNavUiState: BottomNavUiState = BottomNavUiState(),
    val toolbarUiState: ToolbarUiState = ToolbarUiState(),
    val contentPadding: Dp = 20.dp
)

data class ToolbarUiState(
    val isVisible: Boolean = false,
    val navigationIconRes: DrawableResource? = UiRes.drawable.ic_back,
    val text: String = "",
)

data class BottomNavUiState(
    val items: List<Pair<BottomNavItem, ScreenRoute>> = emptyList(),
    val isVisible: Boolean = true,
    val selectedBottomNavIndex: Int = 0
)

sealed interface MainScreenUiEvent {
    data class OnBottomNavItemClick(val bottomNavItem: BottomNavItem) : MainScreenUiEvent
    data object OnToolbarNavItemClick : MainScreenUiEvent
}