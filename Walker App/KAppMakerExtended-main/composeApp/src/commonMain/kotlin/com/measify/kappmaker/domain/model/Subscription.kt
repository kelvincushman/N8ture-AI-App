package com.measify.kappmaker.domain.model

data class Subscription(
    val entitlementId: String? = null,
    val name: String? = null,
    val formattedPrice: String? = null,
    val durationType: DurationType? = null,
    val expirationDateInMillis: Long?,
    val willRenew: Boolean,
    val benefits: List<String> = emptyList()
) {
    enum class DurationType {
        MONTHLY,
        WEEKLY,
        YEARLY,
        LIFETIME,
        UNKNOWN
    }

    val isLifetime: Boolean get() = durationType == DurationType.LIFETIME || expirationDateInMillis == 0L
}

val Subscription?.isFree: Boolean get() = this == null

