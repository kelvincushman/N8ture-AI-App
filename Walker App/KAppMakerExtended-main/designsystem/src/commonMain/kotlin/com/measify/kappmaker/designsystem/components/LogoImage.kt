package com.measify.kappmaker.designsystem.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.ic_logo
import com.measify.kappmaker.designsystem.util.PreviewHelper
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
fun LogoImage(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        Image(
            painter = painterResource(UiRes.drawable.ic_logo),
            contentDescription = null,
            modifier = Modifier.size(140.dp).align(Alignment.Center)
        )
    }
}

@Composable
@Preview
internal fun LogoImagePreview() {
    PreviewHelper {
        LogoImage()
    }
}