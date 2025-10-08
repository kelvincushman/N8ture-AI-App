package com.measify.kappmaker.designsystem.components.modals

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.designsystem.components.AppButton
import com.measify.kappmaker.designsystem.components.ButtonStyle
import com.measify.kappmaker.designsystem.components.DialogOrBottomSheetTitle
import com.measify.kappmaker.designsystem.components.Divider
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.btn_cancel
import com.measify.kappmaker.designsystem.generated.resources.btn_ok
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.designsystem.util.PreviewHelper
import org.jetbrains.compose.resources.stringResource
import org.jetbrains.compose.ui.tooling.preview.Preview


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppModalBottomSheet(
    title: String,
    titleColor: Color = AppTheme.colors.text.primary,
    btnConfirmText: String = stringResource(UiRes.string.btn_ok),
    btnDismissText: String = stringResource(UiRes.string.btn_cancel),
    hideButtons: Boolean = false,
    reverseButtonsOrder: Boolean = false,
    onConfirm: () -> Unit = {},
    onDismiss: () -> Unit = {},
    content: @Composable () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = { onDismiss() },
        shape = RoundedCornerShape(10.dp),
        dragHandle = {
            Column {
                Spacer(modifier = Modifier.height(AppTheme.spacing.defaultSpacing))
                Divider(
                    thickness = 3.dp,
                    modifier = Modifier
                        .width(36.dp)
                        .clip(RoundedCornerShape(16.dp))
                )
            }

        }

    ) {
        Column(
            modifier = Modifier.padding(AppTheme.spacing.outerSpacing),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.sectionSpacing)
        ) {

            DialogOrBottomSheetTitle(
                text = title,
                color = titleColor,
                textAlign = TextAlign.Center,
            )
            Divider(modifier = Modifier.fillMaxWidth())
            content()

            if (hideButtons) return@Column

            Divider(modifier = Modifier.fillMaxWidth())
            Row(
                horizontalArrangement = Arrangement.spacedBy(AppTheme.spacing.horizontalItemSpacing),
                modifier = Modifier.fillMaxWidth()
            ) {
                AppButton(
                    text = if (reverseButtonsOrder) btnConfirmText else btnDismissText,
                    style = ButtonStyle.ALTERNATIVE,
                    modifier = Modifier.weight(1f)
                ) {
                    if (reverseButtonsOrder) onConfirm() else onDismiss()
                }
                AppButton(
                    text = if (reverseButtonsOrder) btnDismissText else btnConfirmText,
                    modifier = Modifier.weight(1f)
                ) {
                    if (reverseButtonsOrder) onDismiss() else onConfirm()
                }
            }


        }

    }
}

@Composable
@Preview
internal fun AppModalBottomSheetPreview() {
    PreviewHelper {
        var isVisible by remember { mutableStateOf(false) }
        var isButtonsVisible by remember { mutableStateOf(true) }
        AppButton("Show Modal Bottom Sheet") {
            isButtonsVisible = true
            isVisible = true
        }
        AppButton("Show Modal Bottom Sheet (No Buttons)") {
            isButtonsVisible = false
            isVisible = true
        }
        if (isVisible) {
            AppModalBottomSheet(
                title = "Modal Bottom Sheet Title",
                hideButtons = !isButtonsVisible,
                onConfirm = {
                    isVisible = false
                },
                onDismiss = {
                    isVisible = false
                }
            ) {
                Text("Modal Bottom Sheet Content")
            }
        }
    }
}