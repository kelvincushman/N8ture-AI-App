package com.measify.kappmaker.util.extensions

import com.measify.kappmaker.domain.model.Subscription
import com.measify.kappmaker.util.Constants
import com.revenuecat.purchases.kmp.Purchases
import com.revenuecat.purchases.kmp.ktx.awaitOfferings
import com.revenuecat.purchases.kmp.models.CustomerInfo
import com.revenuecat.purchases.kmp.models.Package
import com.revenuecat.purchases.kmp.models.PackageType


val Package.productName :String
    get() = storeProduct.title.substringBefore("(")

val Package.productDescription :String
    get() = "${storeProduct.localizedDescription} just for ${storeProduct.price.formatted}"

val Package?.buttonText :String
    get() = if (this == null) "Buy Now" else "Buy Now (${storeProduct.price.formatted})"

suspend fun CustomerInfo.asPremiumSubscription(): Subscription? {
    return asActiveSubscriptionList().find { it.entitlementId == Constants.PAYWALL_PREMIUM_ENTITLEMENT }
}

suspend fun CustomerInfo.asActiveSubscriptionList(): List<Subscription> {

    val purchasesInstance = Purchases.sharedInstance
    val activeEntitlements = this.entitlements.active.map { it.value }
    val activeSubscriptions = activeEntitlements.map { activeEntitlement ->
        val allOfferings = purchasesInstance.awaitOfferings().all.map { it.value }
        val allPackages = allOfferings.flatMap { it.availablePackages }

        val entitlementPackage = allPackages.first {
            it.storeProduct.id == activeEntitlement.productPlanIdentifier ||
                    it.storeProduct.id.contains(activeEntitlement.productIdentifier)
        }

        Subscription(
            entitlementId = activeEntitlement.identifier,
            name = entitlementPackage.productName,
            formattedPrice = entitlementPackage.storeProduct.price.formatted,
            expirationDateInMillis = activeEntitlement.expirationDateMillis,
            willRenew = activeEntitlement.willRenew,
            durationType = when (entitlementPackage.packageType) {
                PackageType.LIFETIME -> Subscription.DurationType.LIFETIME
                PackageType.ANNUAL -> Subscription.DurationType.YEARLY
                PackageType.MONTHLY -> Subscription.DurationType.MONTHLY
                PackageType.WEEKLY -> Subscription.DurationType.WEEKLY
                PackageType.UNKNOWN, PackageType.CUSTOM, PackageType.SIX_MONTH,
                PackageType.THREE_MONTH, PackageType.TWO_MONTH -> Subscription.DurationType.UNKNOWN
            },
        )
    }
    return activeSubscriptions
}