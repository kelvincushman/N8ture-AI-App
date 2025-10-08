package com.measify.kappmaker.designsystem.util

import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.layout
import androidx.compose.ui.text.AnnotatedString.Builder
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.withLink
import androidx.compose.ui.util.fastRoundToInt

// This is to force layout to go beyond the borders of its parent
fun Modifier.fillWidthOfParent(totalParentHorizontalPaddingInPx: Float) =
    this.layout { measurable, constraints ->
        val placeable = measurable.measure(
            constraints.copy(
                maxWidth = constraints.maxWidth + totalParentHorizontalPaddingInPx.fastRoundToInt()
            )
        )
        layout(placeable.width, placeable.height) {
            placeable.place(0, 0)
        }
    }

inline fun Builder.appendLinkIfNotEmpty(
    url: String,
    text: String,
) {
    if (url.isEmpty()) {
        append(text)
        return
    }

    val linkAnnotation = LinkAnnotation.Url(url = url)
    return withLink(linkAnnotation) {
        append(text)
    }
}