package com.measify.kappmaker.designsystem.components.premium

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import com.measify.kappmaker.designsystem.components.AppCardContainer
import com.measify.kappmaker.designsystem.components.AutoResizableText
import com.measify.kappmaker.designsystem.components.Divider
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.current_plan
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.designsystem.util.PreviewHelper
import org.jetbrains.compose.resources.stringResource
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
fun CurrentSubscriptionPlanAndFeatures(
    name: String,
    modifier: Modifier = Modifier,
    price: String? = null,
    duration: String? = null,
    features: List<PremiumFeatureUiState> = emptyList()
) {
    AppCardContainer {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.sectionSpacing)
        ) {

            SubscriptionNameWithPriceAndDuration(name = name, price = price, duration = duration)
            if (features.isNotEmpty()) {
                Divider()
                PremiumFeaturesList(features = features)
            }
            Divider()
            Text(
                text = stringResource(UiRes.string.current_plan),
                style = AppTheme.typography.h5,
                color = AppTheme.colors.text.secondary,
                fontWeight = FontWeight.SemiBold
            )

        }
    }
}

@Composable
private fun SubscriptionNameWithPriceAndDuration(
    name: String,
    price: String? = null,
    duration: String? = null
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.groupedVerticalElementSpacing)
    ) {
        if (price == null) Text(
            text = name,
            style = AppTheme.typography.h1,
            color = AppTheme.colors.text.primary,
            textAlign = TextAlign.Center,
        )
        else {
            Text(
                text = name,
                style = AppTheme.typography.h5,
                color = AppTheme.colors.text.primary,
                textAlign = TextAlign.Center,
            )

            Row(horizontalArrangement = Arrangement.Center) {

                AutoResizableText(
                    text = price,
                    modifier = Modifier.weight(1f, false).alignByBaseline(),
                    style = AppTheme.typography.h1,
                    color = AppTheme.colors.text.primary,
                    textAlign = TextAlign.Center,
                )
                Text(
                    modifier = Modifier.alignByBaseline(),
                    text = " / $duration",
                    style = AppTheme.typography.h6,
                    fontWeight = FontWeight.SemiBold,
                    color = AppTheme.colors.text.primary,
                    textAlign = TextAlign.Center
                )

            }


        }

    }

}

@Composable
@Preview
internal fun CurrentSubscriptionPlanAndFeaturesPreview(modifier: Modifier = Modifier) {
    PreviewHelper {
        val allFreeFeatures = listOf(
            PremiumFeatureUiState(text = "Benefit 1", isIncluded = true),
            PremiumFeatureUiState(text = "Benefit 2", isIncluded = true),
            PremiumFeatureUiState(text = "Benefit 3", isIncluded = true),
            PremiumFeatureUiState(text = "Benefit 4", isIncluded = false),
            PremiumFeatureUiState(text = "Benefit 5", isIncluded = false),
        )
        CurrentSubscriptionPlanAndFeatures(
            name = "Free",
            features = allFreeFeatures
        )
        CurrentSubscriptionPlanAndFeatures(
            name = "Premium",
            features = allFreeFeatures.map { it.copy(isIncluded = true) },
            price = "$19.99",
            duration = "month",
        )

    }

}