package com.measify.kappmaker.util

import com.measify.kappmaker.data.source.featureflag.FeatureFlagManager
import com.measify.kappmaker.presentation.components.ads.AdsManager
import com.measify.kappmaker.presentation.components.ads.IosAdsDisplayer
import com.measify.kappmaker.util.analytics.Analytics

/**
This factory is used to help to use swift libraries in KMP. Actual implementations are provided in swift.
 */
interface SwiftLibDependencyFactory {
    fun provideFeatureFlagManagerImpl(): FeatureFlagManager
    fun provideFirebaseAnalyticsImpl(): Analytics
    fun provideAdsManagerImpl(): AdsManager
    fun provideIosAdsDisplayer(): IosAdsDisplayer
}