package com.measify.kappmaker.presentation.screens.journey

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.*
import kotlinx.datetime.Clock

/**
 * Active Journey Screen - Main screen during journey tracking
 *
 * Features:
 * - Live map view (placeholder for now)
 * - Real-time statistics (distance, duration, elevation, discoveries)
 * - Pause/Resume/Stop controls
 * - Recent discoveries list
 * - Quick action buttons (camera, audio, note)
 *
 * Usage:
 * ```
 * ActiveJourneyScreen(
 *     journey = activeJourney,
 *     recentDiscoveries = discoveries,
 *     onPause = { viewModel.pauseJourney() },
 *     onResume = { viewModel.resumeJourney() },
 *     onStop = { viewModel.endJourney() },
 *     onTakePhoto = { /* Navigate to camera */ },
 *     onRecordAudio = { /* Navigate to audio recorder */ },
 *     onAddNote = { /* Show note dialog */ }
 * )
 * ```
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActiveJourneyScreen(
    journey: Journey,
    recentDiscoveries: List<Discovery> = emptyList(),
    onPause: () -> Unit,
    onResume: () -> Unit,
    onStop: () -> Unit,
    onTakePhoto: () -> Unit,
    onRecordAudio: () -> Unit,
    onAddNote: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showStopDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(journey.title) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { showStopDialog = true }) {
                        Icon(Icons.Default.Stop, "Stop Journey")
                    }
                }
            )
        },
        bottomBar = {
            JourneyActionBar(
                onTakePhoto = onTakePhoto,
                onRecordAudio = onRecordAudio,
                onAddNote = onAddNote,
                isPaused = journey.status == JourneyStatus.PAUSED
            )
        }
    ) { padding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Map View Placeholder (50% of screen)
            JourneyMapPlaceholder(
                route = journey.route,
                discoveries = recentDiscoveries,
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            )

            // Stats Section (30% of screen)
            JourneyStatsCard(
                journey = journey,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            )

            // Pause/Resume Control
            JourneyControlButtons(
                status = journey.status,
                onPause = onPause,
                onResume = onResume,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            )

            // Recent Discoveries (20% of screen)
            if (recentDiscoveries.isNotEmpty()) {
                RecentDiscoveriesSection(
                    discoveries = recentDiscoveries.take(3),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                )
            }
        }
    }

    // Stop Journey Confirmation Dialog
    if (showStopDialog) {
        AlertDialog(
            onDismissRequest = { showStopDialog = false },
            title = { Text("End Journey?") },
            text = {
                Column {
                    Text("You've traveled ${journey.stats.getFormattedDistance()} in ${journey.getFormattedDuration()}")
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Are you sure you want to end this journey?")
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showStopDialog = false
                        onStop()
                    }
                ) {
                    Text("End Journey")
                }
            },
            dismissButton = {
                TextButton(onClick = { showStopDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

/**
 * Map placeholder - will be replaced with actual map integration
 */
@Composable
fun JourneyMapPlaceholder(
    route: List<GeoPoint>,
    discoveries: List<Discovery>,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.Map,
                contentDescription = "Map",
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Live Map View",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "${route.size} GPS points",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (discoveries.isNotEmpty()) {
                Text(
                    "${discoveries.size} discoveries",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

/**
 * Real-time statistics card
 */
@Composable
fun JourneyStatsCard(
    journey: Journey,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                "Journey Statistics",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                // Distance
                StatItem(
                    icon = Icons.Default.Straighten,
                    label = "Distance",
                    value = journey.stats.getFormattedDistance(),
                    modifier = Modifier.weight(1f)
                )

                // Duration
                StatItem(
                    icon = Icons.Default.Timer,
                    label = "Duration",
                    value = journey.getFormattedDuration(),
                    modifier = Modifier.weight(1f)
                )

                // Elevation Gain
                journey.stats.elevationGainMeters?.let { elevation ->
                    StatItem(
                        icon = Icons.Default.Terrain,
                        label = "Elevation",
                        value = "${elevation.toInt()}m",
                        modifier = Modifier.weight(1f)
                    )
                }

                // Discoveries
                StatItem(
                    icon = Icons.Default.Nature,
                    label = "Species",
                    value = journey.getDiscoveryCount().toString(),
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

/**
 * Individual stat item
 */
@Composable
fun StatItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            value,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )
        Text(
            label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

/**
 * Pause/Resume control buttons
 */
@Composable
fun JourneyControlButtons(
    status: JourneyStatus,
    onPause: () -> Unit,
    onResume: () -> Unit,
    modifier: Modifier = Modifier
) {
    AnimatedContent(
        targetState = status,
        transitionSpec = {
            fadeIn() + scaleIn() togetherWith fadeOut() + scaleOut()
        }
    ) { journeyStatus ->
        when (journeyStatus) {
            JourneyStatus.ACTIVE -> {
                Button(
                    onClick = onPause,
                    modifier = modifier.height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.tertiary
                    )
                ) {
                    Icon(Icons.Default.Pause, "Pause")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Pause Journey", style = MaterialTheme.typography.titleMedium)
                }
            }
            JourneyStatus.PAUSED -> {
                Button(
                    onClick = onResume,
                    modifier = modifier.height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Icon(Icons.Default.PlayArrow, "Resume")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Resume Journey", style = MaterialTheme.typography.titleMedium)
                }
            }
            else -> {}
        }
    }
}

/**
 * Recent discoveries list
 */
@Composable
fun RecentDiscoveriesSection(
    discoveries: List<Discovery>,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(
            "Recent Discoveries",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))

        discoveries.forEach { discovery ->
            DiscoveryItem(
                discovery = discovery,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }
    }
}

/**
 * Individual discovery item
 */
@Composable
fun DiscoveryItem(
    discovery: Discovery,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Discovery type icon
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    discovery.getTypeIcon(),
                    style = MaterialTheme.typography.titleMedium
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Discovery info
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    discovery.getSpeciesName() ?: "Unknown Species",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    getTimeAgo(discovery.timestamp),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Confidence badge
            if (discovery.isConfident()) {
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        "${(discovery.identificationResult?.primaryMatch?.confidence?.times(100))?.toInt()}%",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
        }
    }
}

/**
 * Bottom action bar with quick actions
 */
@Composable
fun JourneyActionBar(
    onTakePhoto: () -> Unit,
    onRecordAudio: () -> Unit,
    onAddNote: () -> Unit,
    isPaused: Boolean,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 3.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            // Take Photo
            ActionButton(
                icon = Icons.Default.CameraAlt,
                label = "Photo",
                onClick = onTakePhoto,
                enabled = !isPaused
            )

            // Record Audio
            ActionButton(
                icon = Icons.Default.Mic,
                label = "Audio",
                onClick = onRecordAudio,
                enabled = !isPaused
            )

            // Add Note
            ActionButton(
                icon = Icons.Default.NoteAdd,
                label = "Note",
                onClick = onAddNote,
                enabled = !isPaused
            )
        }
    }
}

/**
 * Quick action button
 */
@Composable
fun ActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    onClick: () -> Unit,
    enabled: Boolean = true,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        FilledIconButton(
            onClick = onClick,
            enabled = enabled,
            modifier = Modifier.size(56.dp),
            colors = IconButtonDefaults.filledIconButtonColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                contentColor = MaterialTheme.colorScheme.onPrimaryContainer
            )
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                modifier = Modifier.size(28.dp)
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            label,
            style = MaterialTheme.typography.labelMedium,
            color = if (enabled) {
                MaterialTheme.colorScheme.onSurface
            } else {
                MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f)
            }
        )
    }
}

/**
 * Calculate time ago from timestamp
 */
fun getTimeAgo(timestamp: kotlinx.datetime.Instant): String {
    val now = Clock.System.now()
    val diff = now.toEpochMilliseconds() - timestamp.toEpochMilliseconds()

    val minutes = diff / 60000
    val hours = minutes / 60

    return when {
        minutes < 1 -> "Just now"
        minutes < 60 -> "$minutes min ago"
        hours < 24 -> "$hours hour${if (hours > 1) "s" else ""} ago"
        else -> "${hours / 24} day${if (hours / 24 > 1) "s" else ""} ago"
    }
}
