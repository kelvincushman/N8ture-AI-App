package com.measify.kappmaker.presentation.components.ads.rewarded

import androidx.activity.ComponentActivity
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.OnUserEarnedRewardListener
import com.measify.kappmaker.presentation.components.ads.AdsRewardItem
import com.measify.kappmaker.presentation.components.ads.FullScreenAdDisplayer
import com.measify.kappmaker.presentation.components.ads.FullScreenAdLoader
import com.measify.kappmaker.util.logging.AppLogger

class RewardedAdDisplayer(
    private val activity: ComponentActivity?,
    private val adLoader: FullScreenAdLoader,
    private val onRewarded: (AdsRewardItem) -> Unit,
) : FullScreenAdDisplayer {

    override fun show() {
        if (adLoader !is RewardedAdLoader) return
        val rewardedAd = adLoader.rewardedAd

        if (rewardedAd == null || activity == null) {
            AppLogger.d("Rewarded ad is not loaded yet")
            adLoader.load()
            return
        }

        rewardedAd.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                super.onAdDismissedFullScreenContent()
                AppLogger.d("Rewarded ad is dismissed, loading new one")
                adLoader.rewardedAd = null
                adLoader.load()
            }

            override fun onAdFailedToShowFullScreenContent(p0: AdError) {
                super.onAdFailedToShowFullScreenContent(p0)
                AppLogger.e("Rewarded ad, failed to show: ${p0.message}")
                adLoader.rewardedAd = null
            }

            override fun onAdShowedFullScreenContent() {
                super.onAdShowedFullScreenContent()
                AppLogger.d("Rewarded ad is shown")
            }
        }
        rewardedAd.show(activity, OnUserEarnedRewardListener { rewardItem ->
            val adsRewardItem = AdsRewardItem(
                amount = rewardItem.amount,
                type = rewardItem.type
            )

            onRewarded(adsRewardItem)
            AppLogger.d("User earned reward: amount: ${rewardItem.amount}, type: ${rewardItem.type}")

        })

    }
}