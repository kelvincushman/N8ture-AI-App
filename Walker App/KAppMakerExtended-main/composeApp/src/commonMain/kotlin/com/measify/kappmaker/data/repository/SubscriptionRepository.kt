package com.measify.kappmaker.data.repository

import com.measify.kappmaker.data.BackgroundExecutor
import com.measify.kappmaker.domain.model.Subscription
import com.measify.kappmaker.util.ApplicationScope
import com.measify.kappmaker.util.Constants.PAYWALL_PREMIUM_ENTITLEMENT
import com.measify.kappmaker.util.extensions.asActiveSubscriptionList
import com.measify.kappmaker.util.logging.AppLogger
import com.measify.kappmaker.util.logging.logSuccessfulPurchase
import com.revenuecat.purchases.kmp.Purchases
import com.revenuecat.purchases.kmp.PurchasesDelegate
import com.revenuecat.purchases.kmp.ktx.awaitCustomerInfo
import com.revenuecat.purchases.kmp.ktx.awaitOfferings
import com.revenuecat.purchases.kmp.ktx.awaitPurchase
import com.revenuecat.purchases.kmp.ktx.awaitRestore
import com.revenuecat.purchases.kmp.models.CacheFetchPolicy
import com.revenuecat.purchases.kmp.models.CustomerInfo
import com.revenuecat.purchases.kmp.models.Package
import com.revenuecat.purchases.kmp.models.PurchasesError
import com.revenuecat.purchases.kmp.models.StoreProduct
import com.revenuecat.purchases.kmp.models.StoreTransaction
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.shareIn

class SubscriptionRepository(
    applicationScope: ApplicationScope,
    private val backgroundExecutor: BackgroundExecutor = BackgroundExecutor.IO
) {
    val currentSubscriptionFlow: Flow<Subscription?> = callbackFlow {
        val delegate = object : PurchasesDelegate {
            override fun onCustomerInfoUpdated(customerInfo: CustomerInfo) {
                trySend(customerInfo)
            }

            override fun onPurchasePromoProduct(
                product: StoreProduct,
                startPurchase: (onError: (error: PurchasesError, userCancelled: Boolean) -> Unit, onSuccess: (storeTransaction: StoreTransaction, customerInfo: CustomerInfo) -> Unit) -> Unit
            ) {
            }
        }
        Purchases.sharedInstance.delegate = delegate
        awaitClose {
            Purchases.sharedInstance.delegate = null
        }
    }
        .map { getCurrentPremiumSubscription() }
        .onStart { emit(getCurrentPremiumSubscription()) }
        .catch { }
        .flowOn(backgroundExecutor.scope)
        .shareIn(applicationScope, SharingStarted.WhileSubscribed(5000), 1)


    fun login(userId: String) {
        Purchases.sharedInstance.logIn(
            newAppUserID = userId,
            onSuccess = { _, _ -> },
            onError = {
                AppLogger.e("Error occurred while login user for purchase")
            }
        )
    }

    fun logOut() {
        Purchases.sharedInstance.logOut(onError = {}, onSuccess = {})
    }

    suspend fun hasPremiumAccess(): Boolean = hasEntitlementAccess(PAYWALL_PREMIUM_ENTITLEMENT)


    suspend fun getCurrentPremiumSubscription(): Subscription? = backgroundExecutor.execute {
        val currentPremiumSubscription =
            getActiveSubscriptionList().find { it.entitlementId == PAYWALL_PREMIUM_ENTITLEMENT }
        Result.success(currentPremiumSubscription)
    }.getOrNull()

    /**
     * Returns a list of active subscriptions. Most of the time this will contain one active subscription
     */
    suspend fun getActiveSubscriptionList(): List<Subscription> = backgroundExecutor.execute {

        val purchasesInstance = Purchases.sharedInstance
        val customerInfo =
            purchasesInstance.awaitCustomerInfo(fetchPolicy = CacheFetchPolicy.CACHED_OR_FETCHED)
        val activeSubscriptions = customerInfo.asActiveSubscriptionList()
        Result.success(activeSubscriptions)
    }.getOrElse { emptyList() }


    suspend fun hasEntitlementAccess(key: String): Boolean = backgroundExecutor.execute {
        val customerInfo =
            Purchases.sharedInstance.awaitCustomerInfo(fetchPolicy = CacheFetchPolicy.CACHED_OR_FETCHED)
        val hasPremium = customerInfo.entitlements.all[key]?.isActive ?: false
        Result.success(hasPremium)
    }.getOrNull() ?: false

    suspend fun getPackageList(placementId: String? = null): Result<List<Package>> =
        backgroundExecutor.execute {
            val offerings = Purchases.sharedInstance.awaitOfferings()
            val currentOffering =
                if (placementId == null) offerings.current
                else offerings.getCurrentOfferingForPlacement(placementId) ?: offerings.current

            val packages =
                currentOffering?.availablePackages?.takeUnless { it.isEmpty() } ?: emptyList()

            val sortedPackages = packages.sortedBy { it.storeProduct.price.amountMicros }
            Result.success(sortedPackages)
        }

    suspend fun purchase(packageToPurchase: Package) = backgroundExecutor.execute {
        val successfulPurchase = Purchases.sharedInstance.awaitPurchase(packageToPurchase)
        AppLogger.logSuccessfulPurchase(extraInfo = "Identifier: ${packageToPurchase.identifier}")
        Result.success(successfulPurchase)
    }

    suspend fun restorePurchase() = backgroundExecutor.execute {
        val customerInfo = Purchases.sharedInstance.awaitRestore()
        val hasSuccessfulRestore = customerInfo.entitlements.all.any { it.value.isActive }
        if (hasSuccessfulRestore) Result.success(customerInfo)
        else Result.failure(Exception("Restore failed. No active subscription found."))
    }

}