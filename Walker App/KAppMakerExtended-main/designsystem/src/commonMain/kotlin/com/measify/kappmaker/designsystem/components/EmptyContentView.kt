package com.measify.kappmaker.designsystem.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.ic_logo
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.designsystem.util.PreviewHelper
import org.jetbrains.compose.resources.DrawableResource
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
fun EmptyContentView(
    title: String,
    text: String,
    image: DrawableResource,
    modifier: Modifier = Modifier.fillMaxSize()
        .padding(
            top = AppTheme.spacing.defaultSpacing,
            start = AppTheme.spacing.outerSpacing,
            end = AppTheme.spacing.outerSpacing,
            bottom = AppTheme.spacing.outerSpacing,
        )

) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Image(
            painter = painterResource(image),
            contentDescription = null,
            modifier = Modifier.size(200.dp)
        )
        Spacer(modifier = Modifier.height(AppTheme.spacing.sectionSpacing))
        ScreenTitle(title, textAlign = TextAlign.Center)
        Spacer(modifier = Modifier.height(AppTheme.spacing.groupedVerticalElementSpacing))
        Text(
            text = text,
            textAlign = TextAlign.Center,
            color = AppTheme.colors.text.secondary,
            style = AppTheme.typography.bodyExtraLarge
        )

    }
}

@Composable
@Preview
internal fun EmptyContentPreview() {
    PreviewHelper {
        EmptyContentView(
            title = "No data found",
            text = "No matching data found. Please search again",
            image = UiRes.drawable.ic_logo
        )
    }
}