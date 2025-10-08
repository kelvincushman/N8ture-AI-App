package com.measify.kappmaker.util

import com.measify.kappmaker.data.source.featureflag.FeatureFlagManager
import com.measify.kappmaker.data.source.local.DatabaseProvider
import com.measify.kappmaker.data.source.local.DatabaseProviderImpl
import com.measify.kappmaker.presentation.components.ads.AdsManager
import com.measify.kappmaker.presentation.components.ads.IosAdsDisplayer
import com.measify.kappmaker.util.analytics.Analytics
import com.mmk.kmpnotifier.notification.NotifierManager
import com.mmk.kmpnotifier.notification.configuration.NotificationPlatformConfiguration
import org.koin.core.module.Module
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.bind
import org.koin.dsl.module
import kotlin.experimental.ExperimentalNativeApi

internal actual val platformModule: Module = module {
    singleOf(::DatabaseProviderImpl) bind DatabaseProvider::class
    factoryOf(::AppUtilImpl) bind AppUtil::class
}

internal fun swiftLibDependenciesModule(factory: SwiftLibDependencyFactory): Module = module {
    single { factory.provideFeatureFlagManagerImpl() } bind FeatureFlagManager::class
    single { factory.provideFirebaseAnalyticsImpl() } bind Analytics::class
    single { factory.provideAdsManagerImpl() } bind AdsManager::class
    single { factory.provideIosAdsDisplayer() } bind IosAdsDisplayer::class
}

internal actual fun onApplicationStartPlatformSpecific() {
    NotifierManager.initialize(NotificationPlatformConfiguration.Ios())

}

internal actual val isAndroid = false

@OptIn(ExperimentalNativeApi::class)
internal actual val isDebug = Platform.isDebugBinary