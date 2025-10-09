package com.measify.kappmaker.presentation.screens.journey

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
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

/**
 * Journey Summary Screen - Displayed after completing a journey
 *
 * Features:
 * - Full journey map with route
 * - Complete statistics
 * - Discovery timeline
 * - Share/Export buttons
 * - Edit title/description
 *
 * Usage:
 * ```
 * JourneySummaryScreen(
 *     journey = completedJourney,
 *     discoveries = allDiscoveries,
 *     onShare = { viewModel.shareJourney() },
 *     onExport = { viewModel.exportAsGPX() },
 *     onEditTitle = { newTitle -> viewModel.updateTitle(newTitle) },
 *     onDelete = { viewModel.deleteJourney() },
 *     onBack = { navController.popBackStack() }
 * )
 * ```
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JourneySummaryScreen(
    journey: Journey,
    discoveries: List<Discovery> = emptyList(),
    onShare: () -> Unit,
    onExport: () -> Unit,
    onEditTitle: (String) -> Unit,
    onDelete: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showEditDialog by remember { mutableStateOf(false) }
    var showDeleteDialog by remember { mutableStateOf(false) }

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
                    IconButton(onClick = { showEditDialog = true }) {
                        Icon(Icons.Default.Edit, "Edit")
                    }
                    IconButton(onClick = { showDeleteDialog = true }) {
                        Icon(Icons.Default.Delete, "Delete")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Journey Date & Time
            item {
                JourneyDateHeader(journey)
            }

            // Map View
            item {
                JourneyMapPlaceholder(
                    route = journey.route,
                    discoveries = discoveries,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(300.dp)
                        .padding(16.dp)
                )
            }

            // Complete Statistics
            item {
                CompleteStatsCard(
                    journey = journey,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                )
            }

            // Weather Info
            journey.weather?.let { weather ->
                item {
                    WeatherCard(
                        weather = weather,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }
            }

            // Discoveries Section
            if (discoveries.isNotEmpty()) {
                item {
                    Text(
                        "Discoveries (${discoveries.size})",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(16.dp)
                    )
                }

                items(discoveries) { discovery ->
                    DiscoveryTimelineItem(
                        discovery = discovery,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                    )
                }
            }

            // Action Buttons
            item {
                Spacer(modifier = Modifier.height(16.dp))
                JourneyActions(
                    onShare = onShare,
                    onExport = onExport,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                )
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }

    // Edit Title Dialog
    if (showEditDialog) {
        EditTitleDialog(
            currentTitle = journey.title,
            onDismiss = { showEditDialog = false },
            onConfirm = { newTitle ->
                onEditTitle(newTitle)
                showEditDialog = false
            }
        )
    }

    // Delete Confirmation Dialog
    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Journey?") },
            text = { Text("This action cannot be undone. All data for this journey will be permanently deleted.") },
            confirmButton = {
                Button(
                    onClick = {
                        showDeleteDialog = false
                        onDelete()
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.error
                    )
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

/**
 * Journey date and time header
 */
@Composable
fun JourneyDateHeader(journey: Journey) {
    val localDateTime = journey.startTime.toLocalDateTime(TimeZone.currentSystemDefault())

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.CalendarToday,
                contentDescription = "Date",
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    "${localDateTime.month} ${localDateTime.dayOfMonth}, ${localDateTime.year}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "Started at ${localDateTime.hour}:${localDateTime.minute.toString().padStart(2, '0')}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

/**
 * Complete statistics card with all metrics
 */
@Composable
fun CompleteStatsCard(
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
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(16.dp))

            // Primary Stats Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatItem(
                    icon = Icons.Default.Straighten,
                    label = "Distance",
                    value = journey.stats.getFormattedDistance()
                )
                StatItem(
                    icon = Icons.Default.Timer,
                    label = "Duration",
                    value = journey.getFormattedDuration()
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider()
            Spacer(modifier = Modifier.height(16.dp))

            // Secondary Stats Grid
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                journey.stats.elevationGainMeters?.let { elevation ->
                    DetailedStatRow(
                        icon = Icons.Default.Terrain,
                        label = "Elevation Gain",
                        value = "${elevation.toInt()}m"
                    )
                }

                journey.stats.avgSpeedMps?.let { speed ->
                    DetailedStatRow(
                        icon = Icons.Default.Speed,
                        label = "Average Speed",
                        value = journey.stats.getFormattedAvgSpeed() ?: "N/A"
                    )
                }

                DetailedStatRow(
                    icon = Icons.Default.Nature,
                    label = "Discoveries",
                    value = "${journey.getDiscoveryCount()} species"
                )

                DetailedStatRow(
                    icon = Icons.Default.Route,
                    label = "GPS Points",
                    value = "${journey.route.size} locations"
                )
            }
        }
    }
}

/**
 * Detailed stat row with icon
 */
@Composable
fun DetailedStatRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            label,
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.weight(1f)
        )
        Text(
            value,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Bold
        )
    }
}

/**
 * Weather information card
 */
@Composable
fun WeatherCard(
    weather: WeatherSnapshot,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.tertiaryContainer
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                weather.condition.icon,
                style = MaterialTheme.typography.displayMedium
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    weather.getFormattedTemperature(),
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    weather.condition.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onTertiaryContainer
                )
            }
            Spacer(modifier = Modifier.weight(1f))
            Column(horizontalAlignment = Alignment.End) {
                weather.humidity?.let { humidity ->
                    Text(
                        "Humidity: $humidity%",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                weather.windSpeed?.let { wind ->
                    Text(
                        "Wind: ${wind.toInt()} m/s",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }
    }
}

/**
 * Discovery timeline item
 */
@Composable
fun DiscoveryTimelineItem(
    discovery: Discovery,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        onClick = { /* Navigate to discovery detail */ }
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Type icon
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    discovery.getTypeIcon(),
                    style = MaterialTheme.typography.titleLarge
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Discovery info
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    discovery.getSpeciesName() ?: "Unknown Species",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    discovery.type.name.replace('_', ' ').lowercase().replaceFirstChar { it.uppercase() },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (discovery.userNotes != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        discovery.userNotes,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2
                    )
                }
            }

            // Confidence or favorite indicator
            if (discovery.isFavorite) {
                Icon(
                    Icons.Default.Star,
                    "Favorite",
                    tint = MaterialTheme.colorScheme.primary
                )
            } else if (discovery.isConfident()) {
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        "${(discovery.identificationResult?.primaryMatch?.confidence?.times(100))?.toInt()}%",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelMedium
                    )
                }
            }
        }
    }
}

/**
 * Action buttons (Share, Export)
 */
@Composable
fun JourneyActions(
    onShare: () -> Unit,
    onExport: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Button(
            onClick = onShare,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.Share, "Share")
            Spacer(modifier = Modifier.width(8.dp))
            Text("Share Journey")
        }

        OutlinedButton(
            onClick = onExport,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.Download, "Export")
            Spacer(modifier = Modifier.width(8.dp))
            Text("Export as GPX")
        }
    }
}

/**
 * Edit title dialog
 */
@Composable
fun EditTitleDialog(
    currentTitle: String,
    onDismiss: () -> Unit,
    onConfirm: (String) -> Unit
) {
    var title by remember { mutableStateOf(currentTitle) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Edit Journey Title") },
        text = {
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Title") },
                singleLine = true
            )
        },
        confirmButton = {
            Button(onClick = { onConfirm(title) }) {
                Text("Save")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
