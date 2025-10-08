package com.measify.kappmaker.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.EdibilityStatus
import com.measify.kappmaker.domain.model.SafetyColor
import com.measify.kappmaker.domain.model.getSafetyColor

/**
 * Safety indicator showing edibility status with color coding
 * 🟢 Green - Safe/Edible
 * 🟡 Yellow - Caution/Conditional
 * 🔴 Red - Dangerous/Poisonous
 * ⚪ Gray - Unknown/Not Applicable
 */
@Composable
fun SafetyIndicator(
    edibilityStatus: EdibilityStatus,
    modifier: Modifier = Modifier,
    showLabel: Boolean = true
) {
    val safetyColor = edibilityStatus.getSafetyColor()
    val (color, label, description) = getSafetyInfo(edibilityStatus)

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Color indicator dot
        Box(
            modifier = Modifier
                .size(24.dp)
                .clip(CircleShape)
                .background(color)
        )

        if (showLabel) {
            Column {
                Text(
                    text = label,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
    }
}

/**
 * Prominent safety badge for results screen
 */
@Composable
fun SafetyBadge(
    edibilityStatus: EdibilityStatus,
    modifier: Modifier = Modifier
) {
    val (color, label, description) = getSafetyInfo(edibilityStatus)

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        color = color.copy(alpha = 0.2f),
        border = androidx.compose.foundation.BorderStroke(2.dp, color)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(16.dp)
                    .clip(CircleShape)
                    .background(color)
            )
            Text(
                text = label.uppercase(),
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}

/**
 * Get color and text info for safety status
 */
private fun getSafetyInfo(status: EdibilityStatus): Triple<Color, String, String> {
    return when (status) {
        EdibilityStatus.EDIBLE -> Triple(
            Color(0xFF4CAF50), // Green
            "Safe to Eat",
            "Edible species"
        )
        EdibilityStatus.CONDITIONALLY_EDIBLE -> Triple(
            Color(0xFFFFC107), // Yellow/Amber
            "Caution",
            "Requires preparation"
        )
        EdibilityStatus.INEDIBLE -> Triple(
            Color(0xFF9E9E9E), // Gray
            "Inedible",
            "Not recommended for consumption"
        )
        EdibilityStatus.POISONOUS -> Triple(
            Color(0xFFF44336), // Red
            "Dangerous",
            "Toxic - Do Not Consume"
        )
        EdibilityStatus.NOT_APPLICABLE -> Triple(
            Color(0xFF9E9E9E), // Gray
            "Not Applicable",
            "Wildlife species"
        )
        EdibilityStatus.UNKNOWN -> Triple(
            Color(0xFF9E9E9E), // Gray
            "Unknown",
            "Insufficient data"
        )
    }
}