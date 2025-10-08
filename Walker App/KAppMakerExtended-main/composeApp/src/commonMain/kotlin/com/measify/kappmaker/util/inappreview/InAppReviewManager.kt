package com.measify.kappmaker.util.inappreview

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.measify.kappmaker.data.source.preferences.UserPreferences
import com.measify.kappmaker.util.logging.AppLogger
import kotlinx.datetime.Clock
import org.koin.compose.koinInject
import kotlin.time.Duration.Companion.days


@Composable
expect fun rememberInAppReviewManager(): InAppReviewManager

@Composable
fun rememberInAppReviewTrigger(): InAppReviewTrigger {
    val inAppReviewManager = rememberInAppReviewManager()
    val userPreferences: UserPreferences = koinInject()

    return remember {
        InAppReviewTrigger(
            inAppReviewManager = inAppReviewManager,
            userPreferences = userPreferences
        )
    }
}

interface InAppReviewManager {

    fun requestReview()
}

class InAppReviewTrigger(
    private val inAppReviewManager: InAppReviewManager,
    private val userPreferences: UserPreferences
) {

    private companion object {
        const val KEY_LAST_TIME_REVIEW_SHOWN = "KEY_LAST_TIME_REVIEW_SHOWN"
        val COOLDOWN_DURATION = 7.days //Until this time passes, the review will not be shown again
    }

    /**
     * Tries to show review after a successful purchase event.
     */
    suspend fun triggerAfterSuccessfulPurchase() {
        showReviewPromptIfEligible(ignoreCooldownPeriod = true, onShown = {
            AppLogger.i("Tried to show in app review after successful purchase")
        })
    }

    /**
     * Below is example method for showing review after generating an image.
     * Modify based on your primary action
     *
     * Tries to show review prompt after generating an image.
     * Shows once every 10 credits used.
     */
//    suspend fun triggerAfterImageIsGenerated() {
//        val usedCredits = userPreferences.getInt(UserPreferences.KEY_NB_IMAGE_GENERATE, 0) ?: 0
//        showReviewPromptIfEligible(
//            condition = { usedCredits % 10 == 0 },
//            onShown = {
//                AppLogger.i("Tried to show in app review after image is generated")
//            }
//        )
//    }


    private suspend inline fun showReviewPromptIfEligible(
        condition: () -> Boolean = { true },
        ignoreCooldownPeriod: Boolean = false,
        onShown: () -> Unit = {}
    ) {
        val now = Clock.System.now()
        val lastPromptTime = userPreferences.getLong(KEY_LAST_TIME_REVIEW_SHOWN, 0L) ?: 0L
        val isCooldownOver =
            now.toEpochMilliseconds() - lastPromptTime >= COOLDOWN_DURATION.inWholeMilliseconds
        if ((isCooldownOver || ignoreCooldownPeriod) && condition()) {
            inAppReviewManager.requestReview()
            userPreferences.putLong(KEY_LAST_TIME_REVIEW_SHOWN, now.toEpochMilliseconds())
            onShown()
        }
        return
    }
}