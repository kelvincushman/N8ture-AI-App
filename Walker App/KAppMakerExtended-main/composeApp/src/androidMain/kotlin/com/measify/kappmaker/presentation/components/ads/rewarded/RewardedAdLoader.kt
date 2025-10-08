package com.measify.kappmaker.presentation.components.ads.rewarded

import android.content.Context
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.measify.kappmaker.presentation.components.ads.AdsConfig
import com.measify.kappmaker.presentation.components.ads.FullScreenAdLoader
import com.measify.kappmaker.util.logging.AppLogger

class RewardedAdLoader(private val context: Context) : FullScreenAdLoader {
    var rewardedAd: RewardedAd? = null

    override fun load() {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(context, AdsConfig.getRewardedAdId(), adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    AppLogger.d("Rewarded ad is loaded")
                    rewardedAd = ad
                }

                override fun onAdFailedToLoad(adError: LoadAdError) {
                    AppLogger.e("Error loading rewarded ad: ${adError.message}")
                    rewardedAd = null
                }

            })
    }
}