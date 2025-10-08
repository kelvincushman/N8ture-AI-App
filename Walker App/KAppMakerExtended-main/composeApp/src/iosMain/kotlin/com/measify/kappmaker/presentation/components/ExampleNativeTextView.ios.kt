package com.measify.kappmaker.presentation.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.UIKitViewController
import com.measify.kappmaker.util.LocalNativeViewFactory

@Composable
actual fun ExampleNativeTextView(text: String, modifier: Modifier) {

    val factory = LocalNativeViewFactory.current
    val view = remember(factory) { factory.createSwiftTextView(text) }

    UIKitViewController(
        modifier = modifier,
        factory = { view },
    )
}