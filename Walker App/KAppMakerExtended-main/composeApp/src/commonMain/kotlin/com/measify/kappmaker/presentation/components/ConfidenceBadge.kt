package com.measify.kappmaker.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.SpeciesMatch

/**
 * Confidence badge showing AI identification confidence
 */
@Composable
fun ConfidenceBadge(
    match: SpeciesMatch,
    modifier: Modifier = Modifier,
    size: ConfidenceBadgeSize = ConfidenceBadgeSize.MEDIUM
) {
    val percentage = match.getConfidencePercentage()
    val (color, label) = getConfidenceInfo(match)

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(size.cornerRadius),
        color = color.copy(alpha = 0.15f)
    ) {
        Row(
            modifier = Modifier.padding(
                horizontal = size.horizontalPadding,
                vertical = size.verticalPadding
            ),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = "$percentage%",
                style = when (size) {
                    ConfidenceBadgeSize.SMALL -> MaterialTheme.typography.labelSmall
                    ConfidenceBadgeSize.MEDIUM -> MaterialTheme.typography.labelMedium
                    ConfidenceBadgeSize.LARGE -> MaterialTheme.typography.titleMedium
                },
                fontWeight = FontWeight.Bold,
                color = color
            )
            if (size != ConfidenceBadgeSize.SMALL) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelSmall,
                    color = color.copy(alpha = 0.8f)
                )
            }
        }
    }
}

/**
 * Circular confidence indicator (alternative style)
 */
@Composable
fun ConfidenceCircle(
    match: SpeciesMatch,
    modifier: Modifier = Modifier
) {
    val percentage = match.getConfidencePercentage()
    val color = getConfidenceColor(match)

    Box(
        modifier = modifier
            .size(60.dp)
            .background(
                color = color.copy(alpha = 0.1f),
                shape = RoundedCornerShape(50)
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "$percentage%",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = when {
                    match.isHighConfidence() -> "High"
                    match.isMediumConfidence() -> "Med"
                    else -> "Low"
                },
                style = MaterialTheme.typography.labelSmall,
                color = color.copy(alpha = 0.7f)
            )
        }
    }
}

enum class ConfidenceBadgeSize(
    val horizontalPadding: androidx.compose.ui.unit.Dp,
    val verticalPadding: androidx.compose.ui.unit.Dp,
    val cornerRadius: androidx.compose.ui.unit.Dp
) {
    SMALL(6.dp, 2.dp, 4.dp),
    MEDIUM(12.dp, 6.dp, 8.dp),
    LARGE(16.dp, 8.dp, 12.dp)
}

/**
 * Get confidence color based on level
 */
private fun getConfidenceColor(match: SpeciesMatch): Color {
    return when {
        match.isHighConfidence() -> Color(0xFF4CAF50) // Green
        match.isMediumConfidence() -> Color(0xFFFFA726) // Orange
        else -> Color(0xFFEF5350) // Red
    }
}

/**
 * Get confidence info (color + label)
 */
private fun getConfidenceInfo(match: SpeciesMatch): Pair<Color, String> {
    return when {
        match.isHighConfidence() -> Pair(Color(0xFF4CAF50), "High")
        match.isMediumConfidence() -> Pair(Color(0xFFFFA726), "Medium")
        else -> Pair(Color(0xFFEF5350), "Low")
    }
}