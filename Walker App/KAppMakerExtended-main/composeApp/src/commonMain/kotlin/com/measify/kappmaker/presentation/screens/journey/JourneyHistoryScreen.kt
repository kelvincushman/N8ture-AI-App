package com.measify.kappmaker.presentation.screens.journey

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.*
import kotlinx.datetime.*

/**
 * Journey History Screen - View all past journeys
 *
 * Features:
 * - List of completed journeys
 * - Search and filter functionality
 * - Grouped by date (Today, This Week, This Month, Earlier)
 * - Journey preview cards with key stats
 * - Pull to refresh
 * - Floating action button to start new journey
 *
 * Usage:
 * ```
 * JourneyHistoryScreen(
 *     journeys = journeyHistory,
 *     onJourneyClick = { journey -> navController.navigate("journey/${journey.id}") },
 *     onStartNewJourney = { viewModel.startNewJourney() },
 *     onSearch = { query -> viewModel.searchJourneys(query) }
 * )
 * ```
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JourneyHistoryScreen(
    journeys: List<Journey>,
    onJourneyClick: (Journey) -> Unit,
    onStartNewJourney: () -> Unit,
    onSearch: (String) -> Unit = {},
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var showSearch by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            if (showSearch) {
                SearchBar(
                    query = searchQuery,
                    onQueryChange = {
                        searchQuery = it
                        onSearch(it)
                    },
                    onCloseSearch = {
                        showSearch = false
                        searchQuery = ""
                        onSearch("")
                    }
                )
            } else {
                TopAppBar(
                    title = { Text("My Journeys") },
                    actions = {
                        IconButton(onClick = { showSearch = true }) {
                            Icon(Icons.Default.Search, "Search")
                        }
                        IconButton(onClick = { /* Filter menu */ }) {
                            Icon(Icons.Default.FilterList, "Filter")
                        }
                    }
                )
            }
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onStartNewJourney,
                icon = { Icon(Icons.Default.Add, "Start Journey") },
                text = { Text("Start Journey") }
            )
        }
    ) { padding ->
        if (journeys.isEmpty()) {
            EmptyJourneysView(
                onStartNewJourney = onStartNewJourney,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            )
        } else {
            val groupedJourneys = groupJourneysByTime(journeys)

            LazyColumn(
                modifier = modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                groupedJourneys.forEach { (period, journeysInPeriod) ->
                    item {
                        Text(
                            period,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
                        )
                    }

                    items(journeysInPeriod) { journey ->
                        JourneyHistoryCard(
                            journey = journey,
                            onClick = { onJourneyClick(journey) },
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

/**
 * Search bar for filtering journeys
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    onCloseSearch: () -> Unit
) {
    TopAppBar(
        title = {
            TextField(
                value = query,
                onValueChange = onQueryChange,
                placeholder = { Text("Search journeys...") },
                singleLine = true,
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = androidx.compose.ui.graphics.Color.Transparent,
                    unfocusedIndicatorColor = androidx.compose.ui.graphics.Color.Transparent
                ),
                modifier = Modifier.fillMaxWidth()
            )
        },
        navigationIcon = {
            IconButton(onClick = onCloseSearch) {
                Icon(Icons.Default.ArrowBack, "Close search")
            }
        },
        actions = {
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(Icons.Default.Clear, "Clear")
                }
            }
        }
    )
}

/**
 * Empty state when no journeys exist
 */
@Composable
fun EmptyJourneysView(
    onStartNewJourney: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            Icons.Default.Hiking,
            contentDescription = "No journeys",
            modifier = Modifier.size(120.dp),
            tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            "No Journeys Yet",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            "Start tracking your nature walks and discoveries",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(32.dp))
        Button(
            onClick = onStartNewJourney,
            modifier = Modifier
                .width(200.dp)
                .height(56.dp)
        ) {
            Icon(Icons.Default.Add, "Start")
            Spacer(modifier = Modifier.width(8.dp))
            Text("Start First Journey")
        }
    }
}

/**
 * Journey history preview card
 */
@Composable
fun JourneyHistoryCard(
    journey: Journey,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header row with title and date
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        journey.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        formatJourneyDate(journey.startTime),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Status badge
                if (journey.isPublic) {
                    Surface(
                        color = MaterialTheme.colorScheme.primaryContainer,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.Public,
                                contentDescription = "Public",
                                modifier = Modifier.size(14.dp),
                                tint = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                "Public",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Stats row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                JourneyStatChip(
                    icon = Icons.Default.Straighten,
                    value = journey.stats.getFormattedDistance()
                )
                JourneyStatChip(
                    icon = Icons.Default.Timer,
                    value = journey.getFormattedDuration()
                )
                journey.stats.elevationGainMeters?.let { elevation ->
                    JourneyStatChip(
                        icon = Icons.Default.Terrain,
                        value = "${elevation.toInt()}m"
                    )
                }
                JourneyStatChip(
                    icon = Icons.Default.Nature,
                    value = "${journey.getDiscoveryCount()}"
                )
            }

            // Tags if present
            if (journey.tags.isNotEmpty()) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    journey.tags.take(3).forEach { tag ->
                        Surface(
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                tag,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                style = MaterialTheme.typography.labelSmall
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Compact stat chip for journey card
 */
@Composable
fun JourneyStatChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    value: String,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        color = MaterialTheme.colorScheme.surfaceVariant,
        shape = RoundedCornerShape(8.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                value,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

/**
 * Group journeys by time period
 */
fun groupJourneysByTime(journeys: List<Journey>): Map<String, List<Journey>> {
    val now = Clock.System.now()
    val today = now.toLocalDateTime(TimeZone.currentSystemDefault()).date
    val thisWeekStart = today.minus(today.dayOfWeek.ordinal, DateTimeUnit.DAY)
    val thisMonthStart = LocalDate(today.year, today.month, 1)

    return journeys
        .sortedByDescending { it.startTime }
        .groupBy { journey ->
            val journeyDate = journey.startTime.toLocalDateTime(TimeZone.currentSystemDefault()).date

            when {
                journeyDate == today -> "Today"
                journeyDate >= thisWeekStart -> "This Week"
                journeyDate >= thisMonthStart -> "This Month"
                journeyDate.year == today.year -> "Earlier This Year"
                else -> journeyDate.year.toString()
            }
        }
}

/**
 * Format journey date for display
 */
fun formatJourneyDate(instant: Instant): String {
    val localDateTime = instant.toLocalDateTime(TimeZone.currentSystemDefault())
    val now = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
    val date = localDateTime.date

    val timeStr = "${localDateTime.hour}:${localDateTime.minute.toString().padStart(2, '0')}"

    return when {
        date == now.date -> "Today at $timeStr"
        date == now.date.minus(1, DateTimeUnit.DAY) -> "Yesterday at $timeStr"
        else -> "${date.month.name.take(3)} ${date.dayOfMonth}, ${date.year} at $timeStr"
    }
}
