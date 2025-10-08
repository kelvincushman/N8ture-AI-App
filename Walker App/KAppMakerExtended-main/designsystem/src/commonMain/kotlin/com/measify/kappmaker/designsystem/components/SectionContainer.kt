package com.measify.kappmaker.designsystem.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.designsystem.util.PreviewHelper
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
fun SectionContainer(
    title: String? = null,
    subtitle: String? = null,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {

    Column(modifier = modifier) {
        if (title != null) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(AppTheme.spacing.defaultSpacing),
                verticalAlignment = Alignment.CenterVertically
            ) {
                SectionTitle(text = title)
                subtitle?.let {
                    Text(
                        text = it,
                        color = AppTheme.colors.text.secondary,
                        style = AppTheme.typography.bodyLarge
                    )
                }
            }

            Spacer(modifier = Modifier.height(AppTheme.spacing.sectionHeaderSpacing))
        }
        content()
    }
}

@Composable
@Preview
internal fun SectionContainerPreview() {
    PreviewHelper {
        SectionContainer(title = "Section Title", subtitle = "Section Subtitle") {
            Text(text = "Section Content")
        }
    }
}