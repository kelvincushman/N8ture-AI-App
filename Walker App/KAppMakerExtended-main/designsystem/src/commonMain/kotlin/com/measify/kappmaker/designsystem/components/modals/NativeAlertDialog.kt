package com.measify.kappmaker.designsystem.components.modals

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.measify.kappmaker.designsystem.components.AppButton
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.btn_cancel
import com.measify.kappmaker.designsystem.generated.resources.btn_ok
import com.measify.kappmaker.designsystem.util.PreviewHelper
import org.jetbrains.compose.resources.stringResource
import org.jetbrains.compose.ui.tooling.preview.Preview


/**
 * Shows Native dialog. In Android AlertDialog, in iOS UIAlerts.
 *
 * @param title The title of the dialog.
 * @param text The text of the dialog.
 * @param btnConfirmText The text of the confirm button.
 * @param btnDismissText The text of the dismiss button.
 * @param dismissOnClickOutside Indicates should dismiss dialog when clicking outside.
 * @param onConfirm Lambda that is invoked when the confirm button is clicked.
 * @param onDismiss Lambda that is invoked when the dismiss button is clicked.
 */
@Composable
expect fun NativeAlertDialog(
    title: String,
    text: String,
    btnConfirmText: String = stringResource(UiRes.string.btn_ok),
    btnDismissText: String = stringResource(UiRes.string.btn_cancel),
    dismissOnClickOutside: Boolean = true,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit = {},
)

@Preview
@Composable
internal fun NativeDialogPreview() {
    PreviewHelper {
        var isNativeDialogVisible by remember { mutableStateOf(false) }
        AppButton("Show Native Dialog", onClick = { isNativeDialogVisible = true })
        if (isNativeDialogVisible) {
            NativeAlertDialog(
                title = "Native Dialog Title",
                text = "Native Dialog Body text",
                btnConfirmText = "Confirm",
                btnDismissText = "Dismiss",
                dismissOnClickOutside = false,
                onConfirm = {
                    isNativeDialogVisible = false
                },
                onDismiss = {
                    isNativeDialogVisible = false
                },
            )
        }
    }
}