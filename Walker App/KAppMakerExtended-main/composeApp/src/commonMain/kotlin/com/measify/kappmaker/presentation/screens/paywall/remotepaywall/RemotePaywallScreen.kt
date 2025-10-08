package com.measify.kappmaker.presentation.screens.paywall.remotepaywall

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.measify.kappmaker.domain.model.Subscription
import com.measify.kappmaker.designsystem.components.LoadingProgress
import com.measify.kappmaker.designsystem.components.LoadingProgressMode
import com.measify.kappmaker.designsystem.components.modals.AppDialog
import com.measify.kappmaker.designsystem.components.modals.DialogType
import com.measify.kappmaker.designsystem.components.premium.PremiumFeatureUiState
import com.measify.kappmaker.presentation.components.premium.PremiumFeatureFactory
import com.measify.kappmaker.presentation.components.premium.SuccessfulPurchaseView
import com.measify.kappmaker.util.UiMessage
import com.measify.kappmaker.util.extensions.asFormattedDate
import com.measify.kappmaker.util.extensions.asPremiumSubscription
import com.measify.kappmaker.util.logging.AppLogger
import com.revenuecat.purchases.kmp.models.CustomerInfo
import com.revenuecat.purchases.kmp.models.PurchasesError
import com.revenuecat.purchases.kmp.models.StoreTransaction
import com.revenuecat.purchases.kmp.ui.revenuecatui.Paywall
import com.revenuecat.purchases.kmp.ui.revenuecatui.PaywallListener
import com.revenuecat.purchases.kmp.ui.revenuecatui.PaywallOptions


@Composable
fun RemotePaywallScreen(onDismiss: () -> Unit) {
    var errorMessage by remember { mutableStateOf<UiMessage?>(null) }
    var successfulPurchaseCustomerInfo by remember { mutableStateOf<CustomerInfo?>(null) }
    var successfulSubscription by remember { mutableStateOf<Subscription?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    if (successfulPurchaseCustomerInfo != null) {
        LaunchedEffect(successfulPurchaseCustomerInfo) {
            isLoading = true
            successfulSubscription = successfulPurchaseCustomerInfo?.asPremiumSubscription()
            isLoading = false
        }
    }

    errorMessage?.let {
        AppDialog(
            type = DialogType.ERROR,
            text = it.value,
            onConfirm = {
                errorMessage = null
                onDismiss()
            }
        )
    }
    successfulSubscription?.let { subscription ->
        SuccessfulPurchaseView(
            modifier = Modifier.fillMaxSize(),
            features = PremiumFeatureFactory.ofSubscription(successfulSubscription),
            isRecurring = subscription.willRenew,
            isLifetime = subscription.isLifetime,
            expirationDate = subscription.expirationDateInMillis?.asFormattedDate(),
            onContinue = {
                onDismiss()
                successfulPurchaseCustomerInfo = null
                successfulSubscription = null
            }
        )
    }

    val paywallOptions = remember {
        PaywallOptions(dismissRequest = {
            if (successfulPurchaseCustomerInfo == null) onDismiss()
        }) {
            this.shouldDisplayDismissButton = true
            this.listener = object : PaywallListener {
                override fun onPurchaseCompleted(
                    customerInfo: CustomerInfo,
                    storeTransaction: StoreTransaction
                ) {
                    //Successful payment
                    super.onPurchaseCompleted(customerInfo, storeTransaction)
                    AppLogger.d("Successful payment, onPurchaseCompleted")
                    successfulPurchaseCustomerInfo = customerInfo

                }

                override fun onPurchaseError(error: PurchasesError) {
                    super.onPurchaseError(error)
                    AppLogger.e("There was an error with purchase: $error")
                    errorMessage =
                        UiMessage.Message("There was an error with purchase: ${error.message}")
                }

                override fun onRestoreCompleted(customerInfo: CustomerInfo) {
                    super.onRestoreCompleted(customerInfo)
                    AppLogger.d("Successful restore, onRestoreCompleted")
                    val isSuccessfulRestore =
                        customerInfo.entitlements.all.any { it.value.isActive }

                    if (!isSuccessfulRestore) {
                        errorMessage =
                            UiMessage.Message("There was an error with restoring purchase")
                    } else
                        successfulPurchaseCustomerInfo = customerInfo
                }

                override fun onRestoreError(error: PurchasesError) {
                    super.onRestoreError(error)
                    AppLogger.e("There was an error with restore purchase: $error")
                    errorMessage =
                        UiMessage.Message("There was an error with restore purchase: ${error.message}")
                }
            }
        }
    }
    Paywall(options = paywallOptions)
    if (isLoading) LoadingProgress(mode = LoadingProgressMode.FULLSCREEN)
}