package com.measify.kappmaker.presentation.screens.helpandsupport

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import com.measify.kappmaker.designsystem.components.SettingItemListContainer
import com.measify.kappmaker.designsystem.components.SettingsItemUiState
import com.measify.kappmaker.designsystem.generated.resources.privacy_policy
import com.measify.kappmaker.designsystem.generated.resources.terms_conditions
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.generated.resources.Res
import com.measify.kappmaker.generated.resources.item_contact_support
import com.measify.kappmaker.util.AppUtil
import com.measify.kappmaker.util.Constants
import org.koin.compose.koinInject
import com.measify.kappmaker.designsystem.generated.resources.UiRes

@Composable
fun HelpAndSupportScreen(
    modifier: Modifier = Modifier,
) {

    val itemList = listOf(
        SettingsItemUiState(textRes = Res.string.item_contact_support),
        SettingsItemUiState(textRes = UiRes.string.privacy_policy),
        SettingsItemUiState(textRes = UiRes.string.terms_conditions),
    )
    val localUriHandler = LocalUriHandler.current
    val appUtil = koinInject<AppUtil>()
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AppTheme.colors.background)
            .padding(horizontal = AppTheme.spacing.outerSpacing)
            .verticalScroll(rememberScrollState())
            .padding(
                top = AppTheme.spacing.defaultSpacing,
                bottom = AppTheme.spacing.outerSpacing,
            )
    ) {

        SettingItemListContainer(
            itemList = itemList,
            itemTextStyle = AppTheme.typography.h5.copy(fontWeight = FontWeight.SemiBold),
            onClick = {
                when (it.textRes) {
                    Res.string.item_contact_support -> {
                        appUtil.openFeedbackMail()
                    }

                    UiRes.string.privacy_policy -> {
                        localUriHandler.openUri(Constants.URL_PRIVACY_POLICY)
                    }

                    UiRes.string.terms_conditions -> {
                        localUriHandler.openUri(Constants.URL_TERMS_CONDITIONS)
                    }
                }
            }
        )
    }


}
