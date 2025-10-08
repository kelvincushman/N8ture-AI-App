package com.measify.kappmaker.util

import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.ktx.Firebase
import com.google.firebase.remoteconfig.ktx.remoteConfig
import com.google.firebase.remoteconfig.ktx.remoteConfigSettings
import com.measify.kappmaker.BuildConfig
import com.measify.kappmaker.data.source.featureflag.FeatureFlagManager
import com.measify.kappmaker.data.source.featureflag.FeatureFlagManagerImpl
import com.measify.kappmaker.data.source.local.DatabaseProvider
import com.measify.kappmaker.data.source.local.DatabaseProviderImpl
import com.measify.kappmaker.presentation.components.ads.AdsManager
import com.measify.kappmaker.presentation.components.ads.AdsManagerImpl
import com.measify.kappmaker.util.analytics.Analytics
import com.measify.kappmaker.util.analytics.FirebaseAnalyticsImpl
import com.mmk.kmpnotifier.notification.NotifierManager
import com.mmk.kmpnotifier.notification.configuration.NotificationPlatformConfiguration
import org.koin.core.module.Module
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.bind
import org.koin.dsl.module

internal actual val platformModule: Module = module {
    singleOf(::DatabaseProviderImpl) bind DatabaseProvider::class
    factoryOf(::AppUtilImpl) bind AppUtil::class
    single<FeatureFlagManagerImpl> {
        val remoteConfig = Firebase.remoteConfig.apply {
            setConfigSettingsAsync(remoteConfigSettings {
                // set minimumFetchIntervalInSeconds to 0 to get fresh updates in debug mode for testing
                if (BuildConfig.DEBUG) minimumFetchIntervalInSeconds = 3600
            })
            setDefaultsAsync(FeatureFlagManager.DEFAULT_VALUES)
        }
        FeatureFlagManagerImpl(remoteConfig = remoteConfig)
    } bind FeatureFlagManager::class
    single { FirebaseAnalyticsImpl(firebaseAnalytics = Firebase.analytics) } bind Analytics::class
    singleOf(::AdsManagerImpl) bind AdsManager::class
}

internal actual fun onApplicationStartPlatformSpecific() {
    NotifierManager.initialize(
        configuration = NotificationPlatformConfiguration.Android(
            notificationIconResId = android.R.drawable.ic_menu_compass
        )
    )

}

internal actual val isAndroid = true
internal actual val isDebug = BuildConfig.DEBUG