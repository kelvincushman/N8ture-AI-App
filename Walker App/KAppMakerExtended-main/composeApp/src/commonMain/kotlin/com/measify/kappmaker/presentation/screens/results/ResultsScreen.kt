package com.measify.kappmaker.presentation.screens.results

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.IdentificationResult
import com.measify.kappmaker.presentation.components.ConfidenceBadge
import com.measify.kappmaker.presentation.components.SafetyBadge
import kotlinx.serialization.Serializable

@Serializable
data class ResultsScreenRoute(val identificationId: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ResultsScreen(
    result: IdentificationResult,
    onBack: () -> Unit,
    onViewDetails: (String) -> Unit,
    onSave: () -> Unit,
    onShare: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Identification Result") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onShare) {
                        Icon(Icons.Default.Share, "Share")
                    }
                    IconButton(onClick = onSave) {
                        Icon(Icons.Default.Favorite, "Save")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                SafetyBadge(
                    edibilityStatus = result.primaryMatch.species.edibility,
                    modifier = Modifier.fillMaxWidth()
                )
            }
            
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            result.primaryMatch.species.commonName,
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            result.primaryMatch.species.scientificName,
                            style = MaterialTheme.typography.titleMedium,
                            fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                        )
                        Spacer(Modifier.height(8.dp))
                        ConfidenceBadge(
                            match = result.primaryMatch,
                            modifier = Modifier.align(Alignment.End)
                        )
                    }
                }
            }
            
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Description", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        Text(result.primaryMatch.species.description)
                    }
                }
            }
            
            item {
                Button(
                    onClick = { onViewDetails(result.primaryMatch.species.id) },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("View Full Details")
                }
            }
            
            if (result.alternativeMatches.isNotEmpty()) {
                item {
                    Text("Alternative Matches", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                items(result.alternativeMatches) { match ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(match.species.commonName, fontWeight = FontWeight.SemiBold)
                                Text(match.species.scientificName, style = MaterialTheme.typography.bodySmall)
                            }
                            Text("${(match.confidenceScore * 100).toInt()}%", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
