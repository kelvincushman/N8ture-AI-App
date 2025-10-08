package com.measify.kappmaker.util

import androidx.compose.runtime.Composable
import org.jetbrains.compose.resources.StringResource
import org.jetbrains.compose.resources.stringResource

sealed interface UiMessage {

    @get:Composable
    val value: String

    data class Resource(val id: StringResource) : UiMessage {

        override val value: String
            @Composable get() = stringResource(id)
    }

    data class Message(val message: String?) : UiMessage {
        override val value: String
            @Composable get() = message ?: ""
    }
}