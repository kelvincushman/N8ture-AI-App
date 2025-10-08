package com.measify.kappmaker.presentation.components.premium

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import com.measify.kappmaker.designsystem.components.premium.PremiumFeatureUiState
import com.measify.kappmaker.designsystem.components.premium.SuccessfulPurchaseContent
import com.measify.kappmaker.util.Constants.subscriptionUrl
import com.measify.kappmaker.util.inappreview.rememberInAppReviewTrigger

@Composable
fun SuccessfulPurchaseView(
    features: List<PremiumFeatureUiState> = emptyList(),
    expirationDate: String? = null,
    isLifetime: Boolean = false,
    isRecurring: Boolean = true,
    modifier: Modifier = Modifier,
    onContinue: () -> Unit = {}
) {

    val inAppReviewTrigger = rememberInAppReviewTrigger()
    LaunchedEffect(Unit) {
        inAppReviewTrigger.triggerAfterSuccessfulPurchase()
    }

    SuccessfulPurchaseContent(
        subscriptionUrl = subscriptionUrl,
        features = features,
        expirationDate = expirationDate,
        isLifetime = isLifetime,
        isRecurring = isRecurring,
        modifier = modifier,
        onContinue = onContinue
    )
}

