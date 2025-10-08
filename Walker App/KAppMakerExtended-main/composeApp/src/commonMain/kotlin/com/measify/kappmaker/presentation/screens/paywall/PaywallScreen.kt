package com.measify.kappmaker.presentation.screens.paywall

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.measify.kappmaker.designsystem.components.AgreePrivacyPolicyTermsConditionsText
import com.measify.kappmaker.designsystem.components.AppButton
import com.measify.kappmaker.designsystem.components.AppToolbar
import com.measify.kappmaker.designsystem.components.ButtonStyle
import com.measify.kappmaker.designsystem.components.LoadingProgress
import com.measify.kappmaker.designsystem.components.LoadingProgressMode
import com.measify.kappmaker.designsystem.components.ScreenTitle
import com.measify.kappmaker.designsystem.components.modals.AppDialog
import com.measify.kappmaker.designsystem.components.modals.DialogType
import com.measify.kappmaker.designsystem.components.premium.PremiumFeatureUiState
import com.measify.kappmaker.designsystem.components.premium.PremiumFeaturesList
import com.measify.kappmaker.designsystem.generated.resources.ic_check
import com.measify.kappmaker.designsystem.generated.resources.ic_close
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.generated.resources.Res
import com.measify.kappmaker.generated.resources.btn_restore_purchase
import com.measify.kappmaker.presentation.components.premium.PremiumFeatureFactory
import com.measify.kappmaker.presentation.components.premium.SuccessfulPurchaseView
import com.measify.kappmaker.util.Constants
import com.measify.kappmaker.util.extensions.asFormattedDate
import com.measify.kappmaker.util.extensions.productDescription
import com.measify.kappmaker.util.extensions.productName
import com.revenuecat.purchases.kmp.models.Package
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.resources.stringResource
import com.measify.kappmaker.designsystem.generated.resources.UiRes

@Composable
fun PaywallScreen(
    modifier: Modifier = Modifier,
    uiStateHolder: PaywallUiStateHolder,
    onDismiss: () -> Unit,
    onSignInRequired: () -> Unit,
) {
    val uiState by uiStateHolder.uiState.collectAsStateWithLifecycle()

    if (uiState.signInActionRequired) {
        LaunchedEffect(uiState.signInActionRequired) {
            onSignInRequired()
            uiStateHolder.onSignInActionHandled()
        }
    }

    uiState.successfulSubscription?.let { subscription ->
        SuccessfulPurchaseView(
            modifier = Modifier.fillMaxSize(),
            features = PremiumFeatureFactory.ofSubscription(subscription),
            isRecurring = subscription.willRenew,
            isLifetime = subscription.isLifetime,
            expirationDate = subscription.expirationDateInMillis?.asFormattedDate(),
            onContinue = {
                onDismiss()
                uiStateHolder.onSuccessfulPurchaseHandled()
            }
        )
    }

    uiState.errorMessage?.let {
        AppDialog(
            type = DialogType.ERROR,
            text = it.value,
            onConfirm = {
                uiStateHolder.onMessageShown()
                onDismiss()
            }
        )
    }
    PaywallScreen(
        modifier = modifier
            .fillMaxSize()
            .background(AppTheme.colors.background),
        uiState = uiState,
        onUiEvent = uiStateHolder::onUiEvent,
        onDismiss = onDismiss
    )
}

@Composable
fun PaywallScreen(
    modifier: Modifier = Modifier,
    uiState: PaywallUiState,
    onUiEvent: (PaywallUiEvent) -> Unit,
    onDismiss: () -> Unit,
) {
    Column(modifier = modifier) {
        AppToolbar(
            title = "",
            navigationIcon = painterResource(UiRes.drawable.ic_close),
            onNavigationIconClick = { onDismiss() }
        )

        if (uiState.isLoading) {
            LoadingProgress(mode = LoadingProgressMode.FULLSCREEN)
        } else
            PaywallScreenData(
                modifier = modifier.padding(
                    start = AppTheme.spacing.outerSpacing,
                    end = AppTheme.spacing.outerSpacing,
                    top = AppTheme.spacing.defaultSpacing,
                    bottom = AppTheme.spacing.outerSpacing
                ),
                uiState = uiState,
                onUiEvent = onUiEvent
            )
    }


}

@Composable
private fun PaywallScreenData(
    modifier: Modifier = Modifier,
    uiState: PaywallUiState,
    onUiEvent: (PaywallUiEvent) -> Unit
) {

    Column(modifier, verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.sectionSpacing)) {
        Column(
            modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.sectionSpacing)
        ) {

            ScreenTitle(text = uiState.title)
            PremiumFeaturesList(
                features = uiState.features.map { PremiumFeatureUiState(it) }
            )
            Column(verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.verticalListItemSpacing)) {
                uiState.packages.forEach { rcPackage ->
                    PackageItem(
                        rcPackage = rcPackage,
                        isSelected = rcPackage == uiState.selectedPackage,
                        onPackageSelected = {
                            onUiEvent(PaywallUiEvent.OnSelectPackage(rcPackage))
                        },
                    )
                }

            }
        }

        Column {
            AppButton(
                text = uiState.buyButtonText,
                style = ButtonStyle.PRIMARY,
                enabled = uiState.buyButtonEnabled,
                onClick = { onUiEvent(PaywallUiEvent.OnClickBuy) },
                modifier = Modifier.align(Alignment.CenterHorizontally).fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(AppTheme.spacing.groupedVerticalElementSpacing))
            AppButton(
                onClick = { onUiEvent(PaywallUiEvent.OnClickRestore) },
                text = stringResource(Res.string.btn_restore_purchase),
                style = ButtonStyle.TEXT,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(AppTheme.spacing.defaultSpacing))
            AgreePrivacyPolicyTermsConditionsText(
                modifier = Modifier.fillMaxWidth(),
                privacyPolicyUrl = Constants.URL_PRIVACY_POLICY,
                termsConditionsUrl = Constants.URL_TERMS_CONDITIONS
            )
        }


    }

}

@Composable
fun PackageItem(
    modifier: Modifier = Modifier,
    rcPackage: Package,
    isSelected: Boolean,
    onPackageSelected: () -> Unit
) {


    val shape = RoundedCornerShape(10.dp)
    val borderColor = if (isSelected) AppTheme.colors.primary else AppTheme.colors.outline
    val containerColor =
        if (isSelected) AppTheme.colors.alternative else AppTheme.colors.surfaceContainer

    Card(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .clickable { onPackageSelected() },
        border = BorderStroke(2.dp, borderColor),
        colors = CardDefaults.cardColors(containerColor = containerColor)
    ) {
        Column(
            modifier = Modifier.padding(AppTheme.spacing.cardContentSpacing),
            verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.defaultSpacing)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(AppTheme.spacing.inputIconTextSpacing),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(24.dp)
                        .border(1.dp, borderColor, CircleShape)
                        .padding(4.dp)
                ) {
                    if (isSelected) Icon(
                        painter = painterResource(UiRes.drawable.ic_check),
                        tint = AppTheme.colors.text.primary,
                        contentDescription = "Check"
                    )
                }
                Text(
                    text = rcPackage.productName,
                    style = AppTheme.typography.bodyExtraLarge,
                    color = AppTheme.colors.text.primary,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Text(
                text = rcPackage.productDescription,
                style = AppTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
                color = AppTheme.colors.text.primary
            )
        }
    }
}