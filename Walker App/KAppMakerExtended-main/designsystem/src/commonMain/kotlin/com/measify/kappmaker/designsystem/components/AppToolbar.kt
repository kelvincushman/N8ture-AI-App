package com.measify.kappmaker.designsystem.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.calculateEndPadding
import androidx.compose.foundation.layout.calculateStartPadding
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.ic_back
import com.measify.kappmaker.designsystem.generated.resources.ic_close
import com.measify.kappmaker.designsystem.generated.resources.ic_crown
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.designsystem.util.PreviewHelper
import com.measify.kappmaker.designsystem.util.fillWidthOfParent
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.ui.tooling.preview.Preview

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppToolbar(
    title: String,
    onNavigationIconClick: () -> Unit,
    modifier: Modifier = Modifier,
    navigationIcon: Painter? = painterResource(UiRes.drawable.ic_back),
    contentPadding: PaddingValues = PaddingValues(horizontal = AppTheme.spacing.outerSpacing),
    actions: @Composable RowScope.() -> Unit = {},
) {
    val navigationIconStartPadding =
        contentPadding.calculateStartPadding(LocalLayoutDirection.current)
    val actionsEndPadding = contentPadding.calculateEndPadding(LocalLayoutDirection.current)

    CenterAlignedTopAppBar(
        modifier = modifier.defaultMinSize(minHeight = 72.dp),
        colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
            containerColor = AppTheme.colors.background,
            titleContentColor = AppTheme.colors.text.primary,
            navigationIconContentColor = AppTheme.colors.text.primary,
            actionIconContentColor = AppTheme.colors.text.primary,
        ),
        title = {
            Box(modifier = Modifier.fillMaxHeight(), contentAlignment = Alignment.Center) {
                ToolbarTitle(text = title)
            }
        },
        navigationIcon = {
            //Material toolbar has default 4dp extra padding, and 10dp icon touch padding
            val extraPadding = 10.dp
            val startPadding = (navigationIconStartPadding - extraPadding).coerceAtLeast(0.dp)
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .offset(x = (-4).dp)
                    .padding(start = startPadding),
                contentAlignment = Alignment.Center
            ) {
                navigationIcon?.let { NavigationIcon(it, onNavigationIconClick) }

            }
        },
        actions = {
            //Material toolbar has default 4dp extra padding
            val endPadding = actionsEndPadding.coerceAtLeast(0.dp)
            Row(
                modifier = Modifier
                    .fillMaxHeight()
                    .offset(x = (4).dp)
                    .padding(end = endPadding),
                verticalAlignment = Alignment.CenterVertically
            ) {
                actions()
            }
        }

    )

}

@Composable
private fun NavigationIcon(
    navigationIcon: Painter,
    onNavigationIconClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    Box(
        modifier = Modifier
            .size(48.dp)
            .clip(CircleShape)
            .clickable(
                onClick = { onNavigationIconClick() },
                role = Role.Button,
                interactionSource = interactionSource,
                indication = ripple(bounded = false, radius = 20.dp)
            ).padding(10.dp),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            painter = navigationIcon,
            modifier = Modifier.fillMaxSize(),
            contentDescription = "Navigation Icon",
        )
    }

}

@Composable
private fun ToolbarTitle(
    text: String,
    modifier: Modifier = Modifier,
    textAlign: TextAlign = TextAlign.Center
) {
    Text(
        text = text,
        style = AppTheme.typography.h4,
        color = AppTheme.colors.text.primary,
        textAlign = textAlign,
        modifier = modifier
    )
}

@Preview
@Composable
internal fun AppToolbarPreview() {
    PreviewHelper {
        val totalHorizontalPadding =
            LocalDensity.current.run { 2 * AppTheme.spacing.outerSpacing.toPx() }
        AppToolbar(
            title = "Home",
            onNavigationIconClick = {},
            navigationIcon = null,
            actions = {
                Chip(
                    text = "Pro",
                    style = ChipStyle.FILLED,
                    size = ChipSize.SMALL,
                    startIconRes = UiRes.drawable.ic_crown,
                    onClick = {}
                )
            },
            modifier = Modifier.fillWidthOfParent(totalHorizontalPadding)
        )
        AppToolbar(
            title = "Settings Screen",
            onNavigationIconClick = {},
            modifier = Modifier.fillWidthOfParent(totalHorizontalPadding)
        )
        AppToolbar(
            title = "Details Screen",
            navigationIcon = painterResource(UiRes.drawable.ic_close),
            onNavigationIconClick = {},
            modifier = Modifier.fillWidthOfParent(totalHorizontalPadding)
        )

    }
}

