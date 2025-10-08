package com.measify.kappmaker.data.source.featureflag

interface FeatureFlagManager {

    object Keys {
        const val IS_ADS_ENABLED = "is_ads_enabled"
        const val IS_ANALYTICS_ENABLED = "is_analytics_enabled"
        const val SHOW_REMOTE_PAYWALL = "show_remote_paywall"
    }

    companion object {
        //Add Optional Default Feature Flag Values Here
        val DEFAULT_VALUES = mapOf(
            Keys.IS_ADS_ENABLED to false,
            Keys.IS_ANALYTICS_ENABLED to true,
            Keys.SHOW_REMOTE_PAYWALL to true // Change to false for presenting custom paywall screen
        )
    }

    fun syncsFlagsAsync()
    fun getBoolean(key: String): Boolean
    fun getString(key: String): String
    fun getLong(key: String): Long
    fun getDouble(key: String): Double
}