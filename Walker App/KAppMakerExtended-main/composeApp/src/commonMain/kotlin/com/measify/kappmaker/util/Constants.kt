package com.measify.kappmaker.util

object Constants {
    const val URL_PRIVACY_POLICY = ""
    const val URL_TERMS_CONDITIONS = ""
    const val CONTACT_EMAIL = "team@measify.com"
    const val APPSTORE_APP_ID = ""

    const val PAYWALL_PREMIUM_ENTITLEMENT = "Premium"

    const val LOCAL_DB_STORAGE_NAME = "local_storage.db"


    /**
     * CLOUD_FUNCTIONS_URL should be something like: "https://REGION-PROJECT_ID.cloudfunctions.net"
     * Regions:
     * US(Default): us-central1
     * EU: europe-west1
     */
    const val CLOUD_FUNCTIONS_URL = ""

    val subscriptionUrl =
        if (isAndroid) "https://play.google.com/store/account/subscriptions"
        else "https://apps.apple.com/account/subscriptions"

}

